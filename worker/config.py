import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/ai_task_platform")
    QUEUE_NAME: str = os.getenv("QUEUE_NAME", "ai-task-queue")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

config = Config()
