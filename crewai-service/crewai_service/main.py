import asyncio
import os
from collections import defaultdict
from datetime import datetime

import aiohttp_cors
from aiohttp import web
from crewai_service.api_client import fetch_tasks, update_task_details
from crewai_service.config import config
from crewai_service.logger import logger
from crewai_service.task_processor import process_task

manual_trigger_event = asyncio.Event()


async def task_fetcher(task_queue: asyncio.Queue, tasks_pending_or_in_progress: set):
    while True:
        try:
            # Wait for either the interval or a manual trigger
            await asyncio.wait(
                [
                    asyncio.sleep(config.TASK_FETCH_INTERVAL_SECONDS),
                    manual_trigger_event.wait(),
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
                if task.status == "in_progress" and task.last_heart_beat:
                    last_heartbeat_time = task.last_heart_beat.timestamp()
                    time_since_last_heartbeat = abs(current_time - last_heartbeat_time)
                    logger.info(
                        f"Time since last heartbeat for task {task.id}: {time_since_last_heartbeat}"
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
                        if task.id in tasks_pending_or_in_progress:
                            tasks_pending_or_in_progress.remove(task.id)

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

                    elif task.id not in tasks_pending_or_in_progress:
                        logger.info(f"Adding task to queue: {task.id}")
                        tasks_pending_or_in_progress.add(task.id)
                        await task_queue.put(task)

            # await asyncio.sleep(config.TASK_FETCH_INTERVAL_SECONDS)

        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            # await asyncio.sleep(config.TASK_FETCH_INTERVAL_SECONDS)


async def handle_manual_trigger(request):
    """HTTP handler to manually trigger task fetching."""
    manual_trigger_event.set()
    return web.Response(text="Task fetching triggered manually.", status=200)


async def worker(
    worker_id: int,
    task_queue: asyncio.Queue,
    tasks_pending_or_in_progress: set,
    task_locks: dict,
):
    while True:
        try:
            task = await task_queue.get()

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
                    tasks_pending_or_in_progress.remove(task.id)
                    task_locks.pop(task.id, None)

            task_queue.task_done()
        except Exception as e:
            logger.error(f"Error in worker {worker_id}: {e}")
            await asyncio.sleep(3)


async def async_main():
    task_queue = asyncio.Queue()
    tasks_pending_or_in_progress = set()
    task_locks = defaultdict(asyncio.Lock)

    task_fetcher_task = asyncio.create_task(
        task_fetcher(task_queue, tasks_pending_or_in_progress)
    )

    workers = [
        asyncio.create_task(
            worker(i + 1, task_queue, tasks_pending_or_in_progress, task_locks)
        )
        for i in range(config.MAX_NUM_WORKERS)
    ]

    # Set up the HTTP server for manual triggering
    app = web.Application()
    app.router.add_get("/trigger", handle_manual_trigger)
    # Configure CORS
    cors = aiohttp_cors.setup(
        app,
        defaults={
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        },
    )

    # Add CORS to the route
    for route in list(app.router.routes()):
        cors.add(route)

    runner = web.AppRunner(app)
    await runner.setup()

    # Use environment variables for host and port
    host = os.getenv("HOST", "0.0.0.0")  # Default to 0.0.0.0 for production
    port = int(os.getenv("PORT", 8080))  # Default to 8080 if not set

    try:
        site = web.TCPSite(runner, host, port)
        await site.start()
        logger.info(f"Server started at http://{host}:{port}")
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        logger.error(f"Host: {host}")
        logger.error(f"Port: {port}")
        logger.error(f"Environment variables: {os.environ}")
        raise

    await asyncio.gather(task_fetcher_task, *workers)


def main():
    print("Hello World")
    # asyncio.run(async_main())


if __name__ == "__main__":
    main()
