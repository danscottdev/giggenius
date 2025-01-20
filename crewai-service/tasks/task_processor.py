import asyncio
import json

import aiohttp
from config import HEADERS, config
from match_analysis_flow.src.match_analysis_flow.main import crew_kickoff
from tasks.api_client import (
    create_new_match,
    update_task_details,
    update_task_heartbeat,
)
from tasks.logger import logger
from tasks.models import MatchProcessingTask


async def process_task(task: MatchProcessingTask) -> None:
    logger.info(f"Processing task {task.id}...")

    heartbeat_task = asyncio.create_task(heartbeat_updater(task.id))

    try:
        #  Update task status to "in_progress"
        await update_task_details(task.id, {"status": "in_progress"})

        # Fetch job data from API
        job = await fetch_job(task.job_id)

        parsed_job = {
            "title": job["upwk_title"],
            "description": job["upwk_description"],
        }

        user = await fetch_user(task.user_id)
        candidate_data = user["user_summary"]

        inputs = {
            "candidate_data": candidate_data,
            "job_info": f"JOB TITLE: {parsed_job['title']}\n\nJOB DESCRIPTION: {parsed_job['description']}",
            "red_flag_criteria": user["user_job_vetos"],
        }

        result = await crew_kickoff(inputs)
        print(f"Result: {result}")

        # From result, create JSON object for "match_strength" and "match_analysis"
        result_dict = json.loads(result) if isinstance(result, str) else result
        logger.info("Result_dict: " + json.dumps(result_dict))

        await create_new_match(
            {
                "job_id": task.job_id,
                "match_analysis_status": result_dict,
            }
        )

        #  Update job status to completed
        await update_task_details(
            task.id,
            {
                "status": "completed",
            },
        )

    except Exception as e:
        logger.error(f"Error processing task {task.id}: {e}")
        error_message = str(e)
        await update_task_details(
            task.id,
            {
                "status": "failed",
                "error_message": error_message,
                "attempts": task.attempts + 1,
            },
        )

    finally:
        heartbeat_task.cancel()
        try:
            await heartbeat_task
        except asyncio.CancelledError:
            pass


async def heartbeat_updater(task_id: str):
    while True:
        try:
            await update_task_heartbeat(task_id)
            await asyncio.sleep(config.HEARTBEAT_INTERVAL_SECONDS)
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error updating heartbeat for task {task_id}: {e}")


async def fetch_job(job_id: str) -> dict:
    try:
        url = f"{config.API_BASE_URL}/job?jobId={job_id}"
        logger.info(f"Fetching job: {url}")
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as response:
                if response.status == 200:
                    # logger.info(f"Fetching job. Response: {response}")
                    data = await response.json()
                    logger.info(f"Job fetched: {data}")
                    return data
                else:
                    logger.error(f"Error fetching job: {response.status}")
                    logger.error(f"Error fetching job: {response.text}")
                    logger.error(f"Error fetching job: {url}")
                    return {}
    except aiohttp.ClientError as error:
        logger.error(f"Error fetching job: {error}")
        logger.error(f"Error fetching job: {url}")
        return {}


async def fetch_user(user_id: str) -> dict:
    try:
        url = f"{config.API_BASE_URL}/user?userId={user_id}"
        logger.info(f"Fetching user: {url}")
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as response:
                if response.status == 200:
                    # logger.info(f"Fetching user. Response: {response}")
                    data = await response.json()
                    logger.info(f"User fetched: {data}")
                    return data
                else:
                    logger.error(f"Error fetching user: {response.status}")
                    logger.error(f"Error fetching user: {response.text}")
                    logger.error(f"Error fetching user: {url}")
                    return {}
    except aiohttp.ClientError as error:
        logger.error(f"Error fetching user: {error}")
        logger.error(f"Error fetching user: {url}")
        return {}
