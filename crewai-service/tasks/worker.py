import asyncio
from collections import defaultdict

from tasks.api_client import update_task_details
from tasks.logger import logger
from tasks.task_processor import process_task


async def worker(worker_id, task_queue, tasks_in_progress, task_locks, config):
    """
    Continuously consume tasks from the queue and process them.
    """
    while True:
        try:
            task = await task_queue.get()

            # Each task has its own lock to avoid concurrency issues
            async with task_locks[task.id]:
                logger.info(f"Worker {worker_id} processing task {task.id}...")
                try:
                    await process_task(task)
                except Exception as e:
                    logger.error(f"Error processing task {task.id}: {e}")
                    error_message = str(e)
                    await update_task_details(
                        task.id,
                        {
                            "status": "failed",
                            "errorMessage": error_message,
                            "attempts": task.attempts + 1,
                        },
                    )
                finally:
                    tasks_in_progress.discard(task.id)
                    task_locks.pop(task.id, None)

            task_queue.task_done()
        except Exception as e:
            logger.error(f"Error in worker {worker_id}: {e}")
            await asyncio.sleep(3)
