# AI Task Processing Platform

[![Production CI/CD](https://github.com/your-org/ai-task-processing-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-org/ai-task-processing-platform/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_20-green.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Worker-Python_3.11-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/Frontend-React_18-61dafb.svg)](https://react.dev)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326ce5.svg)](https://kubernetes.io)

An enterprise-grade, asynchronous AI Task Processing Platform built with a React TypeScript frontend, Express TypeScript backend, Python BullMQ worker, MongoDB, Redis Queue, Docker Compose, Kubernetes, Argo CD, and GitHub Actions CI/CD.

---

## 💡 Key Features

- 🔐 **JWT Authentication & Security**: Secure Register/Login flows, JWT tokens, Refresh Tokens, bcrypt password hashing, Helmet, CORS, and Rate Limiting.
- ⚡ **Asynchronous Task Processing**: Decoupled HTTP API enqueues tasks into Redis Queue (BullMQ); Python worker asynchronously executes workload.
- 🛠️ **Supported Operations**:
  - `uppercase`: Converts input string to uppercase.
  - `lowercase`: Converts input string to lowercase.
  - `reverse`: Reverses characters order.
  - `word_count`: Calculates total word count, character count, and line count.
- 📊 **Real-time Task Lifecycle Monitoring**: Live task state updates (`Pending` ➔ `Running` ➔ `Success` / `Failed`).
- 📜 **Execution Logs Stream**: Detailed timestamped execution logs appended in real-time by worker and viewable in frontend console.
- 💎 **Modern Dark Theme UI**: Built with React 18, Vite, TypeScript, TailwindCSS, React Query (with 5-second polling), React Hook Form, Zod, and Lucide Icons.
- 🐳 **Production Docker Containerization**: Multi-stage Alpine Dockerfiles running as non-root users (`node` / `appuser`).
- ☸️ **Kubernetes & Argo CD Ready**: Declarative manifests for Deployments, StatefulSets, Services, HPA, Probes, Ingress, and GitOps Auto-Sync via Argo CD.

---

## 🏗️ Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                    |
|                      React 18 + Vite + TS + TailwindCSS                           |
+----------------------------------------+------------------------------------------+
                                         | REST API (JWT Header)
                                         v
+-----------------------------------------------------------------------------------+
|                              EXPRESS BACKEND                                      |
|            Node.js + TS + Clean Architecture (Controllers/Services/Repos)          |
+-------------------+--------------------+--------------------+---------------------+
                    |                    |                    |
          Mongo URI |                    | Queue Enqueue      | Auth DB
                    v                    v                    v
          +-------------------+  +-------------------+  +-------------------+
          |     MongoDB       |  |    Redis Queue    |  |  Winston Logger   |
          |  (Users & Tasks)  |  |     (BullMQ)      |  |  (App & Errors)   |
          +-------------------+  +---------+---------+  +-------------------+
                                           |
                                           v Job Payload
+-----------------------------------------------------------------------------------+
|                               PYTHON WORKER                                       |
|               Python 3.11 Async Worker + PyMongo Status Updates                   |
+-----------------------------------------------------------------------------------+
```

For full architectural details, see [docs/architecture.md](file:///c:/Users/hp/Desktop/harish/assignment/docs/architecture.md).

---

## 📁 Repository Structure

```
.
├── frontend/             # React + Vite + TS + TailwindCSS + React Query
├── backend/              # Node.js + Express + TS + Clean Architecture + BullMQ
├── worker/               # Python 3.11 BullMQ Worker + PyMongo + Operations Engine
├── docker/               # Production Dockerfiles & docker-compose.yml
├── k8s/                  # Kubernetes Manifests & Argo CD Application CRD
│   └── argo-cd/          # Argo CD GitOps Application definition
├── .github/workflows/    # GitHub Actions CI/CD pipeline
├── docs/                 # Professional Architecture Document
└── README.md             # Project Setup & Operation Manual
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Default Value | Description |
| --- | --- | --- |
| `PORT` | `5000` | HTTP Server Listening Port |
| `NODE_ENV` | `development` | Runtime Environment (`development`/`production`) |
| `MONGODB_URI` | `mongodb://localhost:27017/ai_task_platform` | MongoDB Connection URI |
| `REDIS_HOST` | `localhost` | Redis Server Hostname |
| `REDIS_PORT` | `6379` | Redis Server Port |
| `JWT_SECRET` | `super-secret-jwt-key` | JWT Signing Secret |
| `REFRESH_TOKEN_SECRET` | `super-secret-refresh-key` | Refresh Token Signing Secret |

### Worker (`worker/.env`)
| Variable | Default Value | Description |
| --- | --- | --- |
| `REDIS_HOST` | `localhost` | Redis Server Hostname |
| `REDIS_PORT` | `6379` | Redis Server Port |
| `MONGODB_URI` | `mongodb://localhost:27017/ai_task_platform` | MongoDB Connection URI |
| `QUEUE_NAME` | `ai-task-queue` | BullMQ Queue Name |
| `LOG_LEVEL` | `INFO` | Python Worker Logging Verbosity |

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run the entire platform locally is via Docker Compose:

```bash
# Clone the repository
git clone https://github.com/your-org/ai-task-processing-platform.git
cd ai-task-processing-platform

# Spin up all services (MongoDB, Redis, Backend, Python Worker, Frontend)
npm run docker:up
```

Access the application in your browser:
- **Frontend Dashboard**: `http://localhost` (or `http://localhost:5173` in local dev)
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`

To stop all containers:
```bash
npm run docker:down
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js v20+
- Python 3.11+
- MongoDB & Redis running locally (or via Docker)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Python Worker Setup
```bash
cd worker
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python worker.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

### Backend Unit & Integration Tests (Jest + Supertest)
```bash
cd backend
npm test
```

### Frontend Unit Tests (Vitest)
```bash
cd frontend
npm test
```

---

## 📡 API Reference

### Auth Endpoints

#### Register User
`POST /api/auth/register`
```json
// Request Payload
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Login User
`POST /api/auth/login`
```json
// Request Payload
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Get Current Profile
`GET /api/auth/me` *(Requires Bearer Token)*

---

### Task Endpoints *(All require Bearer Token)*

#### Create Task
`POST /api/tasks`
```json
// Request Payload
{
  "title": "Process Customer Feedback",
  "inputText": "The platform performance is excellent!",
  "operationType": "word_count" // uppercase | lowercase | reverse | word_count
}
```

#### List User Tasks
`GET /api/tasks`

#### Get Task Details
`GET /api/tasks/:id`

#### Execute Task (Enqueue to Redis Worker)
`POST /api/tasks/:id/run`

#### Get Task Logs
`GET /api/tasks/:id/logs`

#### Delete Task
`DELETE /api/tasks/:id`

---

## ☸️ Kubernetes & Argo CD Deployment

### Manual Kubernetes Deployment
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/worker.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

### Argo CD GitOps Sync
Apply the declarative Argo CD Application manifest to enable automatic synchronization, self-healing, and auto-pruning:

```bash
kubectl apply -f k8s/argo-cd/application.yaml
```

---

## 📸 Dashboard Screenshots & UI Preview

| Dashboard Overview | Task Details & Logs Stream |
| --- | --- |
| ![Dashboard Overview Placeholder](https://via.placeholder.com/600x350/0b0f19/6366f1?text=Dashboard+Overview) | ![Task Details Placeholder](https://via.placeholder.com/600x350/0b0f19/10b981?text=Logs+Stream+%26+Result) |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
#   a s s i g n m e n t - a i - w o r k - f l o w  
 