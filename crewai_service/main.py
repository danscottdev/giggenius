import asyncio

from server.server import start_server
from tasks.manager import TaskManager


def main():
    task_manager = TaskManager()
    asyncio.run(start_server(task_manager))


if __name__ == "__main__":
    main()
