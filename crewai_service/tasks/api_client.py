from datetime import datetime
from typing import Any, Dict, List

import aiohttp
from config import HEADERS, config
from tasks.logger import logger
from tasks.models import MatchProcessingTask


class ApiError(Exception):
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


async def fetch_tasks() -> List[MatchProcessingTask]:
    try:
        url = f"{config.API_BASE_URL}/match-processing-task"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as response:
                if response.status == 200:
                    logger.info(f"Fetching analysis tasks...")
                    data = await response.json()
                    logger.info(f"Tasks fetched: {data}")

                    # Parse the JSON data into JobToAnalyze instances
                    tasks = [MatchProcessingTask(**item) for item in data]
                    return tasks

                else:
                    logger.error(f"Error fetching tasks: {response.status}")
                    logger.error(f"Error fetching tasks: {response.text}")
                    logger.error(f"Error fetching tasks: {url}")
                    return []
    except aiohttp.ClientError as error:
        logger.error(f"Error fetching tasks: {error}")
        logger.error(f"Error fetching tasks: {url}")
        return []


async def update_task_details(task_id: str, update_data: Dict[str, Any]) -> None:
    data = {**update_data, "last_heart_beat": datetime.now().isoformat()}
    try:
        url = f"{config.API_BASE_URL}/match-processing-task?taskId={task_id}"
        async with aiohttp.ClientSession() as session:
            async with session.patch(url, json=data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        logger.error(f"Failed to update task details for task {task_id}: {error}")


async def update_task_heartbeat(task_id: str) -> None:
    try:
        url = f"{config.API_BASE_URL}/match-processing-task?taskId={task_id}"
        data = {"last_heart_beat": datetime.now().isoformat()}
        async with aiohttp.ClientSession() as session:
            async with session.patch(url, json=data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        logger.error(f"Failed to update task heartbeat for task {task_id}: {error}")


async def create_new_match(create_data: Dict[str, Any]) -> None:
    logger.info(f"Creating new match: {create_data}")
    # data = {**create_data, "last_heart_beat": datetime.now().isoformat()}
    try:
        url = f"{config.API_BASE_URL}/match"
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=create_data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        logger.error(f"Failed to create match details for match: {error}")
