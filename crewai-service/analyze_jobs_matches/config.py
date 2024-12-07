import os

from dotenv import load_dotenv

load_dotenv()


def get_required_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Missing required environment variable: {key}")
    return value.strip().strip("'\"")


class Config:
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/api")
    SERVER_API_KEY = get_required_env("SERVER_API_KEY")
    STUCK_JOB_THRESHOLD_SECONDS = int(os.getenv("STUCK_JOB_THRESHOLD_SECONDS", "60"))
    MAX_JOB_ATTEMPTS = int(os.getenv("MAX_JOB_ATTEMPTS", "3"))
    MAX_NUM_WORKERS = int(os.getenv("MAX_NUM_WORKERS", "2"))
    HEARTBEAT_INTERVAL_SECONDS = int(os.getenv("HEARTBEAT_INTERVAL_SECONDS", "10"))
    JOB_FETCH_INTERVAL_SECONDS = int(os.getenv("JOB_FETCH_INTERVAL_SECONDS", "10"))
    # MAX_CHUNK_SIZE_BYTES = int(os.getenv("MAX_CHUNK_SIZE_BYTES", str(24 * 1024 * 1024)))
    # OPENAI_MODEL = os.getenv("OPENAI_MODEL", "whisper-1")


config = Config()

HEADERS = {"Authorization": f"Bearer {config.SERVER_API_KEY}"}
