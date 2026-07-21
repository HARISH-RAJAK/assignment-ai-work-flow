import logging
import uuid
from datetime import datetime, timezone
from bson.objectid import ObjectId
from pymongo import MongoClient
from config import config

logger = logging.getLogger("worker.database")

class Database:
    def __init__(self):
        self.client = MongoClient(config.MONGODB_URI)
        self.db = self.client.get_database()
        self.tasks = self.db.tasks

    def update_task_status(self, task_id: str, status: str, log_message: str = None, started: bool = False):
        try:
            now = datetime.now(timezone.utc)
            update_data = {
                "$set": {
                    "status": status,
                    "updatedAt": now
                }
            }

            if started:
                update_data["$set"]["startedAt"] = now

            if log_message:
                timestamp_str = now.isoformat()
                update_data["$push"] = {
                    "logs": f"[{timestamp_str}] {log_message}"
                }

            self.tasks.update_one({"_id": ObjectId(task_id)}, update_data)
            logger.info(f"Task {task_id} status updated to {status}")
        except Exception as e:
            logger.error(f"Error updating task status for {task_id}: {e}")
            raise e

    def complete_task_success(self, task_id: str, result: str, log_message: str):
        try:
            now = datetime.now(timezone.utc)
            timestamp_str = now.isoformat()

            # Retrieve task to determine run number
            task = self.tasks.find_one({"_id": ObjectId(task_id)})
            history = task.get("executionHistory", []) if task else []
            run_number = len(history) + 1
            run_id = f"run_{int(now.timestamp())}_{uuid.uuid4().hex[:5]}"

            run_entry = {
                "runId": run_id,
                "runNumber": run_number,
                "mode": "redis",
                "status": "Success",
                "result": result,
                "logs": [f"[{timestamp_str}] {log_message}"],
                "executedAt": now
            }

            self.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "Success",
                        "result": result,
                        "finishedAt": now,
                        "updatedAt": now
                    },
                    "$push": {
                        "logs": f"[{timestamp_str}] {log_message}",
                        "executionHistory": run_entry
                    }
                }
            )
            logger.info(f"Task {task_id} completed successfully (Run #{run_number})")
        except Exception as e:
            logger.error(f"Error completing task {task_id}: {e}")
            raise e

    def complete_task_failure(self, task_id: str, error_message: str):
        try:
            now = datetime.now(timezone.utc)
            timestamp_str = now.isoformat()

            task = self.tasks.find_one({"_id": ObjectId(task_id)})
            history = task.get("executionHistory", []) if task else []
            run_number = len(history) + 1
            run_id = f"run_{int(now.timestamp())}_{uuid.uuid4().hex[:5]}"

            run_entry = {
                "runId": run_id,
                "runNumber": run_number,
                "mode": "redis",
                "status": "Failed",
                "result": None,
                "logs": [f"[{timestamp_str}] ERROR: {error_message}"],
                "executedAt": now
            }

            self.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "Failed",
                        "finishedAt": now,
                        "updatedAt": now
                    },
                    "$push": {
                        "logs": f"[{timestamp_str}] ERROR: {error_message}",
                        "executionHistory": run_entry
                    }
                }
            )
            logger.info(f"Task {task_id} marked as Failed (Run #{run_number})")
        except Exception as e:
            logger.error(f"Error failing task {task_id}: {e}")
            raise e

db = Database()
