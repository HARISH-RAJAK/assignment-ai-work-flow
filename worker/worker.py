import asyncio
import logging
import signal
import sys
from bullmq import Worker, Job
from config import config
from database import db
from operations import execute_operation

# Configure structured logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("worker.main")

async def process_job(job: Job, token: str):
    """
    Process job consumed from BullMQ redis queue.
    Job data payload expected: { "taskId": "...", "operationType": "...", "inputText": "..." }
    """
    task_id = job.data.get("taskId")
    operation_type = job.data.get("operationType")
    input_text = job.data.get("inputText")

    logger.info(f"Picked up job {job.id} for task {task_id} (Operation: {operation_type})")

    try:
        # Step 1: Update status to Running & record startedAt
        db.update_task_status(
            task_id=task_id,
            status="Running",
            log_message=f"Worker started executing operation '{operation_type}'",
            started=True
        )

        # Artificial micro-delay to simulate AI computation overhead
        await asyncio.sleep(1.5)

        # Step 2: Execute requested operation
        result = execute_operation(operation_type, input_text)

        # Step 3: Record completion & result
        db.complete_task_success(
            task_id=task_id,
            result=result,
            log_message=f"Operation '{operation_type}' finished successfully."
        )

        return {"status": "success", "taskId": task_id, "result": result}

    except Exception as e:
        error_msg = f"Task execution failed: {str(e)}"
        logger.error(f"Error processing job {job.id} (task {task_id}): {error_msg}")
        db.complete_task_failure(task_id=task_id, error_message=error_msg)
        raise e

async def main():
    logger.info(f"Starting Python AI Task Worker connecting to Redis at {config.REDIS_HOST}:{config.REDIS_PORT}")
    
    redis_opts = {
        "host": config.REDIS_HOST,
        "port": config.REDIS_PORT,
    }
    if config.REDIS_PASSWORD:
        redis_opts["password"] = config.REDIS_PASSWORD

    worker = Worker(
        config.QUEUE_NAME,
        process_job,
        {
            "connection": redis_opts,
            "concurrency": 5
        }
    )

    loop = asyncio.get_running_loop()
    stop_event = asyncio.Event()

    def shutdown_signal_handler(sig):
        logger.info(f"Received shutdown signal {sig}. Stopping worker gracefully...")
        stop_event.set()

    if sys.platform == 'win32':
        signal.signal(signal.SIGINT, lambda sig, frame: shutdown_signal_handler('SIGINT'))
        signal.signal(signal.SIGTERM, lambda sig, frame: shutdown_signal_handler('SIGTERM'))
    else:
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, lambda s=sig: shutdown_signal_handler(s.name))

    logger.info(f"Worker listening on queue '{config.QUEUE_NAME}' with concurrency 5...")

    try:
        await stop_event.wait()
    finally:
        logger.info("Closing worker connection...")
        await worker.close()
        logger.info("Worker gracefully shutdown complete.")

if __name__ == "__main__":
    asyncio.run(main())
