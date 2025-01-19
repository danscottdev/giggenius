from aiohttp import web
from crewai_service.logger import logger
from match_analysis_flow.src.match_analysis_flow.main import crew_kickoff
from tasks.fetcher import trigger_fetch


async def handle_manual_trigger(request):
    """HTTP handler to manually trigger task fetching."""
    trigger_fetch()  # calls manual_trigger_event.set()
    return web.Response(text="Task fetching triggered manually.", status=200)


async def handle_run_flow(request):
    logger.info("--------------------------------")
    logger.info("Running flow...")
    data = await request.json()
    result = await crew_kickoff(data)
    logger.info(f"Result: {result}")
    result = {"status": "success", "message": "Flow executed successfully"}
    logger.info(f"Result: {result}")
    return web.json_response(result)


def setup_routes(app):
    app.router.add_get("/trigger", handle_manual_trigger)
    app.router.add_post("/flow", handle_run_flow)
    # Any additional routes as needed
