from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class JobToAnalyze(BaseModel):
    id: str
    title: str
    description: str
    status: Literal[
        "created", "in_progress", "completed", "failed", "max_attempts_exceeded"
    ]
    attempts: int
    createdAt: datetime
    updatedAt: datetime
    lastHeartBeat: datetime
    errorMessage: Optional[str] = None


class Analysis(BaseModel):
    id: str
    jobId: str
    strength: str
    analysis: str
    tokenCount: int
    createdAt: datetime
    updatedAt: datetime
