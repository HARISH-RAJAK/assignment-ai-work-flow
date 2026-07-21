# Stage 1: Build & Dependencies
FROM python:3.11-alpine AS builder

WORKDIR /app

RUN apk add --no-allowed gcc musl-dev libffi-dev

COPY worker/requirements.txt ./
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Production Runner
FROM python:3.11-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /root/.local /home/appuser/.local
COPY worker/ ./

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

RUN chown -R appuser:appgroup /app

USER appuser

CMD ["python", "worker.py"]
