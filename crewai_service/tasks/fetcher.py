import asyncio
from datetime import datetime

from config import config
from tasks.api_client import fetch_tasks, update_task_details
from tasks.logger import logger

manual_trigger_event = asyncio.Event()


async def task_fetcher(task_queue, tasks_in_progress):
    """
    Periodically (or on manual trigger) fetch tasks from the backend,
    handle stuck tasks, and enqueue pending tasks.
    """
    while True:
        try:
            # Wait for either the interval or a manual trigger
            await asyncio.wait(
                [
                    asyncio.create_task(
                        asyncio.sleep(config.TASK_FETCH_INTERVAL_SECONDS)
                    ),
                    asyncio.create_task(manual_trigger_event.wait()),
                ],
                return_when=asyncio.FIRST_COMPLETED,
            )
            # Reset the manual trigger event
            manual_trigger_event.clear()

            current_time = datetime.now().timestamp()
            logger.info(f"Fetching tasks: {current_time}")
            tasks = await fetch_tasks()

            for task in tasks:
                logger.info(f"Task: {task.id}")
                # Handle tasks that appear stuck
                if task.status == "in_progress" and task.last_heart_beat:
                    last_heartbeat_time = task.last_heart_beat.timestamp()
                    time_since_last_heartbeat = abs(current_time - last_heartbeat_time)
                    logger.info(
                        f"Time since last heartbeat for task {task.id}: "
                        f"{time_since_last_heartbeat}"
                    )
                    if time_since_last_heartbeat > config.STUCK_TASK_THRESHOLD_SECONDS:
                        logger.info(f"Task {task.id} is stuck. Failing task.")
                        await update_task_details(
                            task.id,
                            {
                                "status": "failed",
                                "error_message": "Task is stuck - no heartbeat received recently",
                                "attempts": task.attempts + 1,
                            },
                        )
                        tasks_in_progress.discard(task.id)

                # Handle new/failed tasks
                elif task.status in ["new", "failed"]:
                    if task.attempts >= config.MAX_TASK_ATTEMPTS:
                        logger.info(
                            f"TASK {task.id} has exceeded max attempts. Failing task."
                        )
                        await update_task_details(
                            task.id,
                            {
                                "status": "max_attempts_exceeded",
                                "error_message": "Max attempts exceeded",
                            },
                        )
                    else:
                        # If not already in progress, enqueue it
                        if task.id not in tasks_in_progress:
                            logger.info(f"Adding task to queue: {task.id}")
                            tasks_in_progress.add(task.id)
                            await task_queue.put(task)

        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            # Optionally sleep if an error occurs
            # await asyncio.sleep(config.TASK_FETCH_INTERVAL_SECONDS)


def trigger_fetch():
    """
    External function that sets the manual trigger event.
    For example, can be called by an HTTP route or anything else.
    """
    manual_trigger_event.set()
