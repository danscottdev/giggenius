import asyncio
import os

import aiohttp_cors
from aiohttp import web
from config import config
from server.routes import setup_routes
from tasks.fetcher import task_fetcher
from tasks.logger import logger
from tasks.worker import worker


async def create_app(task_manager):
    """
    Create an aiohttp web.Application, configure routes, CORS, etc.
    """
    app = web.Application()

    # Register routes
    setup_routes(app)

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
    for route in list(app.router.routes()):
        cors.add(route)

    # A real "on_startup" callback must be async if it returns a coroutine
    async def on_startup(app):
        await start_background_tasks(app, task_manager)

    # Register the callback
    app.on_startup.append(on_startup)

    return app


async def start_background_tasks(app, task_manager):
    # Just create the tasks; do NOT await them so they run in background
    app["fetcher_task"] = asyncio.create_task(
        task_fetcher(
            task_manager.task_queue,
            task_manager.tasks_in_progress,
        )
    )
    app["worker_tasks"] = [
        asyncio.create_task(
            worker(
                i + 1,
                task_manager.task_queue,
                task_manager.tasks_in_progress,
                task_manager.task_locks,
                # config,
            )
        )
        for i in range(config.MAX_NUM_WORKERS)
    ]
    # Return nothing (or None implicitly).
    # Because it’s async, aiohttp can safely do `await start_background_tasks(...)`.

    # Optionally store references if you want to manage them later
    # app["fetcher_task"] = fetcher_task
    # app["worker_tasks"] = worker_tasks


async def start_server(task_manager):
    """Creates the app, runs the server, and keeps it alive."""
    app = await create_app(task_manager)

    runner = web.AppRunner(app)
    await runner.setup()

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8080))

    site = web.TCPSite(runner, host, port)
    await site.start()
    logger.info(f"Server started at http://{host}:{port}")

    # Keep running forever (or until canceled)
    while True:
        await asyncio.sleep(3600)
