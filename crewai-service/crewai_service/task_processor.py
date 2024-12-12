import asyncio
import json

import aiohttp
from crewai_service.api_client import (  # fetch_asset,; fetch_asset_file,; update_asset_content,
    create_new_match,
    update_task_details,
    update_task_heartbeat,
)
from crewai_service.config import HEADERS, config
from crewai_service.logger import logger
from crewai_service.models import MatchProcessingTask

from .crew import MatchToProposalCrew


async def process_task(task: MatchProcessingTask) -> None:
    logger.info(f"Processing task {task.id}...")

    heartbeat_task = asyncio.create_task(heartbeat_updater(task.id))

    try:
        #  Update task status to "in_progress"
        await update_task_details(task.id, {"status": "in_progress"})

        # Fetch job data from API
        job = await fetch_job(task.job_id)
        print("HERE1")
        # print(job)

        parsed_job = {
            "title": job["upwk_title"],
            "description": job["upwk_description"],
        }
        print(parsed_job)

        candidate_data = """
        Howdy folks! I'm a professional web developer with over 5 years of experience, specializing in fully-custom WordPress development. This includes building out custom themes from scratch, implementing bespoke functionality via custom plugins, and other back-end customizations and integrations. In my time as a developer I've worked on a wide range of wordpress sites, ranging from small mom-and-pop business landing pages all the way up to enterprise-grade systems.
        I'm especially well-versed in customizing and extending GravityForms, and have built out numerous custom plugins that help businesses integrate GravityForms with their existing business logic and systems. I also have extensive experience in getting WordPress sites to properly integrate on the back-end with other third-party business platforms, such as Salesforce.
        Other wordpress-oriented services I offer:
        - PHP upgrades. If your site is running on anything below PHP v8.1, your server is running code that has passed it's official end-of-life. Usually this isn't a *huge* deal, but over time it can create security vulnerabilities on your site, especially depending on what third-party plugins you are using.
        - Server migrations. If you're looking to move your site from one host to another, no problem! I can setup a seamless transition that migrates all the files and database, so no content is lost and there is no downtime.
        - Malware/hacked site recovery. This can be a bit of a wildcard depending on the specifics, if you're facing a problem here, let's chat!
        So if you have any custom wordpress needs, don't hesitate to reach out! I'm a native English speaker based out of Boston, and I'm always happy to hop on a video call to chat more.
        """

        # Replace with your inputs, it will automatically interpolate any tasks and agents information
        inputs = {
            "candidate_data": candidate_data,
            "job_info": f"JOB TITLE: {parsed_job['title']}\n\nJOB DESCRIPTION: {parsed_job['description']}",  # Add the job JSON object to the inputs
        }
        # print(inputs)

        result = MatchToProposalCrew().crew().kickoff(inputs=inputs)
        logger.info("Result: " + result)

        # From result, create JSON object for "match_strength" and "match_analysis"
        result_dict = json.loads(result) if isinstance(result, str) else result
        logger.info("Result_dict: " + json.dumps(result_dict))

        await create_new_match(
            {
                "job_id": task.job_id,
                "match_analysis_status": result_dict,
            }
        )
        # return result

        # TODO: Save Analysis to DB
        # logger.info(f"(PLACEHOLDER) Task {task.id} completed successfully")
        # logger.info(
        #     f"(PLACEHOLDER) Analysis for job ID: {task.job_id} completed successfully"
        # )

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
