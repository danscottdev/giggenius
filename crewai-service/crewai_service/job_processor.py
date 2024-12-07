import asyncio

from crewai_service.api_client import (  # fetch_asset,; fetch_asset_file,; update_asset_content,
    update_job_details,
    update_job_heartbeat,
)
from crewai_service.config import config
from crewai_service.logger import logger
from crewai_service.models import JobToAnalyze


async def process_job(job: JobToAnalyze) -> None:
    logger.info(f"Processing job {job.id}...")

    heartbeat_task = asyncio.create_task(heartbeat_updater(job.id))

    try:
        #  Update job status to "in_progress"
        await update_job_details(job.id, {"status": "in_progress"})

        ##############################
        # TODO: KICKOFF CREW AI HERE
        ##############################

        # TODO: Save Analysis to DB
        logger.info(f"(PLACEHOLDER) Job {job.id} completed successfully")

        #  Update job status to completed
        await update_job_details(job.id, {"status": "completed"})

    except Exception as e:
        logger.error(f"Error processing job {job.id}: {e}")
        error_message = str(e)
        await update_job_details(
            job.id,
            {
                "status": "failed",
                "errorMessage": error_message,
                "attempts": job.attempts + 1,
            },
        )

    finally:
        heartbeat_task.cancel()
        try:
            await heartbeat_task
        except asyncio.CancelledError:
            pass


async def heartbeat_updater(job_id: str):
    while True:
        try:
            await update_job_heartbeat(job_id)
            await asyncio.sleep(config.HEARTBEAT_INTERVAL_SECONDS)
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error updating heartbeat for job {job_id}: {e}")
