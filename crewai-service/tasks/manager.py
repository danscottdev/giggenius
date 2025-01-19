import asyncio
from collections import defaultdict


class TaskManager:
    def __init__(self):
        self.task_queue = asyncio.Queue()
        self.tasks_in_progress = set()
        self.task_locks = defaultdict(asyncio.Lock)
