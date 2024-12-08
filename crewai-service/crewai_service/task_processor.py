import asyncio

from crewai_service.api_client import (  # fetch_asset,; fetch_asset_file,; update_asset_content,
    update_task_details,
    update_task_heartbeat,
)
from crewai_service.config import config
from crewai_service.logger import logger
from crewai_service.models import MatchProcessingTask


async def process_task(task: MatchProcessingTask) -> None:
    logger.info(f"Processing task {task.id}...")

    heartbeat_task = asyncio.create_task(heartbeat_updater(task.id))

    try:
        #  Update task status to "in_progress"
        await update_task_details(task.id, {"status": "in_progress"})

        # Fetch JOB data from API

        ##############################
        # TODO: KICKOFF CREW AI HERE
        ##############################

        # TODO: Save Analysis to DB
        logger.info(f"(PLACEHOLDER) Task {task.id} completed successfully")
        logger.info(
            f"(PLACEHOLDER) Analysis for job ID: {task.job_id} completed successfully"
        )

        #  Update job status to completed
        await update_task_details(task.id, {"status": "completed"})

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
