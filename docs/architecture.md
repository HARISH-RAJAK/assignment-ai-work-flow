# Production AI Task Processing Platform Architecture Document

## 1. Executive Summary & System Overview

The **AI Task Processing Platform** is an enterprise-grade, event-driven, microservices-based distributed platform designed for reliable asynchronous execution of computationally expensive or text-heavy tasks. The platform guarantees high throughput, linear horizontal scalability, strict tenant data isolation, zero message loss, and real-time execution monitoring.

### Key Architectural Pillars
- **Decoupled Asynchronous Processing**: Client requests are accepted immediately by the HTTP Gateway API and enqueued into a persistent Redis Queue managed by BullMQ.
- **Polyglot Microservices**: Express + TypeScript backend handles API gateway routing, authentication, and validation; Python 3.11 workers handle distributed background task execution.
- **Resilient Data Store**: MongoDB serves as the single source of truth for task state, logs, and execution artifacts, while Redis provides sub-millisecond in-memory job queues and lock synchronization.
- **GitOps Infrastructure Deployment**: Kubernetes manifests packaged with Argo CD enable automated, self-healing deployments directly from Git repositories.

---

## 2. High-Level Architecture Diagram

```
+----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                    |
|                      React 18 + Vite + TypeScript (Single Page App)              |
+----------------------------------------+-----------------------------------------+
                                         | REST APIs (JWT Auth)
                                         v
+----------------------------------------------------------------------------------+
|                            INGRESS / GATEWAY LAYER                               |
|                         NGINX Ingress Controller / TLS                           |
+----------------------------------------+-----------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
|                             BACKEND API SERVICE                                  |
|                 Express + Node.js TypeScript (Replicas: 2 - 10)                  |
|   [AuthController] --> [TaskController] --> [TaskService] --> [TaskRepository]  |
+-------------------+--------------------+--------------------+--------------------+
                    |                    |                    |
          Mongo URI |                    | Queue Enqueue      | Auth DB
                    v                    v                    v
          +-------------------+ font  +-------------------+  +-------------------+
          |  MongoDB Cluster  |<-------|    Redis Queue    |  |  Winston Logger   |
          | (Primary/Replica) |        |     (BullMQ)      |  | (Central Stream)  |
          +---------+---------+        +---------+---------+  +-------------------+
                    ^                            |
                    | Status / Logs / Results    | Job Consumption
                    | Update via PyMongo         v
+-------------------+--------------------------------------------------------------+
|                             PYTHON WORKER POOL                                   |
|                Async Python 3.11 Workers (HPA Replicas: 3 - 25)                  |
|    [BullMQ Consumer] --> [Operation Engine] --> [Logger & DB Sync]              |
+----------------------------------------------------------------------------------+
```

---

## 3. Detailed Task Lifecycle & State Machine

```
                      +-------------------+
                      |      Created      |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |      Pending      | (Enqueued in Redis Queue)
                      +---------+---------+
                                |
                                v (Consumed by Worker)
                      +-------------------+
                      |      Running      | (startedAt recorded, PyMongo log appends)
                      +----+---------+----+
                           |         |
            Success Path   |         | Failure Path (Retries Exhausted)
                           v         v
                    +--------------+ +--------------+
                    |   Success    | |    Failed    |
                    +--------------+ +--------------+
```

1. **State `Pending`**: Task is persisted in MongoDB with an empty result set and initial creation timestamp. The task ID and payload are pushed to BullMQ Redis Queue (`ai-task-queue`).
2. **State `Running`**: A Python worker claims the job lock from Redis, updates the MongoDB task state to `Running`, records `startedAt`, and streams an initial log entry.
3. **Execution Phase**: The worker executes the requested operation (`uppercase`, `lowercase`, `reverse`, `word_count`).
4. **State `Success` / `Failed`**:
   - On completion: The worker writes the processed result to `result`, sets `finishedAt`, updates state to `Success`, and appends completion logs.
   - On exception: Exponential backoff retries are attempted up to 3 times. If all retries fail, the job is moved to Dead Letter Queue storage, the MongoDB status is updated to `Failed`, and error logs are appended.

---

## 4. Redis Queue Flow & BullMQ Protocol

BullMQ leverages Redis Data Structures (Hashes, Sorted Sets, Streams, Lua Scripts) for atomic lock management and job scheduling:

- **Active Jobs**: Kept in active ZSETs; atomic claims prevent multiple workers from processing the same task twice.
- **Delayed / Retry Backoff**: When a job fails, BullMQ computes exponential backoff (`2^retry * 2000ms`) and pushes the job to the Delayed ZSET.
- **Dead Letter Queue (DLQ)**: Jobs exceeding max retry limits (`attempts: 3`) transition to the Failed set for inspection and replay without cluttering active streams.

---

## 5. Scaling Strategy for 100,000 Tasks/Day

Processing 100,000 tasks per day requires an average throughput of **~1.16 tasks/sec** and a peak capacity of **10 to 50 tasks/sec** during peak load hours.

### Horizontal Worker Autoscaling (HPA) Strategy
- **Base Worker Replicas**: 3 pods (handling baseline ambient load).
- **Maximum Worker Replicas**: 25 pods.
- **Autoscaling Metrics**:
  - CPU Utilization target: `70%`
  - Memory Utilization target: `80%`
  - KEDA Custom Metric (Optional): Redis Queue length (`ai-task-queue` length > 100 triggers immediate worker pod scale-up).

### Backend Throughput Optimization
- Node.js Express controllers run stateless across 2-10 replicas behind NGINX Ingress Controller.
- Non-blocking I/O ensures API request latency stays `< 25ms` for task enqueuing.

---

## 6. MongoDB Indexing Strategy

To maintain sub-millisecond query latency at scale, compound indexes are applied on the `tasks` collection:

1. **User Task History Index**: `{ userId: 1, createdAt: -1 }`
   - *Rationale*: Accelerates user dashboard queries fetching recent tasks.
2. **Status Filtering Index**: `{ userId: 1, status: 1 }`
   - *Rationale*: Speeds up real-time status filtering (e.g. fetching all `Running` or `Pending` tasks for a user).
3. **Unique Email Index**: `{ email: 1 }` (on `users` collection)
   - *Rationale*: Guarantees zero duplicate account registrations at DB level.

---

## 7. Redis Failure & Disaster Recovery

- **Redis Persistence**: Standard AOF (`appendonly yes`) combined with RDB snapshots every 60 seconds guarantees zero job loss upon container restart.
- **Queue Recovery**: When Redis restarts, BullMQ re-reads the active lock keys and automatically re-queues orphaned jobs whose lock heartbeat expired.
- **Worker Re-connection**: Python workers execute asynchronous retry loops with exponential backoff on Redis connection drop, ensuring automatic recovery.

---

## 8. CI/CD & GitOps Deployment Strategy

### Production Deployment Pipeline
1. **Developer Push**: Code pushed to `main` branch triggers GitHub Actions `.github/workflows/ci-cd.yml`.
2. **Automated Testing**: Runs backend Jest tests and frontend Vitest component tests.
3. **Docker Multi-stage Builds**: Builds Alpine-based production images for Frontend, Backend, and Worker.
4. **Container Registry**: Pushes tagged container images (`ghcr.io/org/repo:<git-sha>`) to registry.
5. **Argo CD Auto-Sync**: Argo CD detects manifest changes in `k8s/`, executes `prune` and `selfHeal`, and performs zero-downtime rolling updates on Kubernetes.

### Staging vs Production Environments
- Managed via separate Kubernetes namespaces (`ai-task-platform-staging` and `ai-task-platform`).
- ConfigMaps and Secrets dynamically injected per environment.

---

## 9. Observability, Logging & Monitoring

- **Structured JSON Logging**: Backend uses Winston logger with correlation IDs; Python worker uses Python `logging` with structured JSON format.
- **Probes**:
  - Backend & Frontend: Kubernetes Liveness (`/health`) and Readiness probes.
  - Worker: Heartbeat ping written to Redis.
- **Metrics Collection**: Prometheus scraping endpoints on Backend + Grafana dashboards for Redis memory and Queue latency tracking.

---

## 10. Security Architecture

1. **Least Privilege Container Security**: All Docker containers run as non-root users (`node`, `appuser`).
2. **HTTP Security Headers**: Express app protected with `helmet` middleware.
3. **API Rate Limiting**: `express-rate-limit` enforces 200 requests/15min on generic APIs and 20 requests/15min on auth endpoints.
4. **Password Hashing & JWT**: Passwords hashed with `bcrypt` (10 rounds); JWT tokens signed with strong secret algorithms.
5. **Input Validation**: Double validation layer using Joi on backend and Zod on frontend.

---

## 11. Future Architectural Enhancements

1. **WebSocket / Server-Sent Events (SSE)**: Replace 5-second polling with real-time push updates for task execution progress.
2. **KEDA Worker Scaling**: Add KEDA (Kubernetes Event-driven Autoscaling) to scale Python worker pods dynamically based on exact Redis queue length.
3. **GPU Task Worker Support**: Add specialized CUDA-enabled Python worker node pools for deep learning model inference (e.g. LLM text generation, Stable Diffusion image generation).
