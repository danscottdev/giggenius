import asyncio

from server.server import start_server
from tasks.manager import TaskManager

# from config import config


def main():
    # loop = asyncio.get_event_loop()
    # task_manager = TaskManager()  # holds queue, locks, set

    # try:
    #     loop.run_until_complete(start_server(task_manager))
    # finally:
    #     loop.close()
    task_manager = TaskManager()
    asyncio.run(start_server(task_manager))


if __name__ == "__main__":
    main()
