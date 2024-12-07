from datetime import datetime
from typing import Any, Dict, List, Optional

import aiohttp

# import tiktoken
from analyze_jobs_matches.config import HEADERS, config
from analyze_jobs_matches.logger import logger
from analyze_jobs_matches.models import Analysis, JobToAnalyze


class ApiError(Exception):
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


async def fetch_jobs() -> List[JobToAnalyze]:
    try:
        url = f"{config.API_BASE_URL}/jobs"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as response:
                if response.status == 200:
                    data = await response.json()

                    # Parse the JSON data into JobToAnalyze instances
                    jobs = [JobToAnalyze(**item) for item in data]
                    return jobs

                else:
                    logger.error(f"Error fetching jobs: {response.status}")
                    logger.error(f"Error fetching jobs: {response.text}")
                    logger.error(f"Error fetching jobs: {url}")
                    return []
    except aiohttp.ClientError as error:
        logger.error(f"Error fetching jobs: {error}")
        logger.error(f"Error fetching jobs: {url}")
        return []


async def update_job_details(job_id: str, update_data: Dict[str, Any]) -> None:
    data = {**update_data, "lastHeartBeat": datetime.now().isoformat()}
    try:
        url = f"{config.API_BASE_URL}/match-processing-task?jobId={job_id}"
        async with aiohttp.ClientSession() as session:
            async with session.patch(url, json=data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        logger.error(f"Failed to update job details for job {job_id}: {error}")


async def update_job_heartbeat(job_id: str) -> None:
    try:
        url = f"{config.API_BASE_URL}/match-processing-task?jobId={job_id}"
        data = {"lastHeartBeat": datetime.now().isoformat()}
        async with aiohttp.ClientSession() as session:
            async with session.patch(url, json=data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        logger.error(f"Failed to update job heartbeat for job {job_id}: {error}")


# async def fetch_asset(asset_id: str) -> Optional[Asset]:
#     try:
#         url = f"{config.API_BASE_URL}/asset?assetId={asset_id}"

#         async with aiohttp.ClientSession() as session:
#             async with session.get(url, headers=HEADERS) as response:
#                 if response.status == 200:
#                     data = await response.json()

#                     if data:
#                         return Asset(**data)

#                     return None

#                 else:
#                     logger.error(f"Error fetching asset: {response.status}")
#                     return None
#     except aiohttp.ClientError as error:
#         logger.error(f"Error fetching asset: {error}")
#         return None


# async def fetch_asset_file(file_url: str) -> bytes:
#     try:
#         async with aiohttp.ClientSession() as session:
#             async with session.get(file_url, headers=HEADERS) as response:
#                 response.raise_for_status()
#                 return await response.read()
#     except aiohttp.ClientError as error:
#         logger.error(f"Error fetching asset file: {error}")
#         raise ApiError("Failed to fetch asset file", status_code=500)


# async def update_asset_content(asset_id: str, content: str) -> None:
#     try:
#         encoding = tiktoken.encoding_for_model("gpt-4o")
#         tokens = encoding.encode(content)
#         token_count = len(tokens)

#         update_data = {
#             "content": content,
#             "tokenCount": token_count,
#         }

#         async with aiohttp.ClientSession() as session:
#             url = f"{config.API_BASE_URL}/asset?assetId={asset_id}"
#             async with session.patch(
#                 url, json=update_data, headers=HEADERS
#             ) as response:
#                 response.raise_for_status()

#     except aiohttp.ClientError as error:
#         logger.error(f"Failed to update asset content for asset {asset_id}: {error}")
#         raise ApiError("Failed to update asset content", status_code=500)
