from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class MatchProcessingTask(BaseModel):
    id: str
    job_id: str
    user_id: str
    status: Literal[
        "new", "in_progress", "completed", "failed", "max_attempts_exceeded"
    ]
    error_message: str | None
    attempts: int
    last_heart_beat: datetime
    created_at: datetime
    updated_at: datetime


class JobToAnalyze(BaseModel):
    id: str
    upwk_title: str
    upwk_description: str
    match_analysis_status: Literal[
        "created", "in_progress", "completed", "failed", "max_attempts_exceeded"
    ]
    created_at: datetime
    updated_at: datetime


class MatchAnalysis(BaseModel):
    match_strength: str
    match_analysis: str


class PrescreenResult(BaseModel):
    red_flag_violation: bool
    red_flag_analysis: str
