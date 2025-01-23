from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

# from pydantic import BaseModel
from tasks.models import PrescreenResult

# Purpose of this crew is to prescreen job opportunities, to determine if it is worthwhile to run a full match analysis on the job
# It will analyze the contents of the job description and compare to a user-defined list of "red flags"
# If the job description violates any of the red flags, the job will be vetoed and the match strength will be set to "-1"
# If the job description does not violate any of the red flags, the job will be passed to the match analysis crew


@CrewBase
class PrescreenCrew:
    """Prescreen Crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def client_screener(self) -> Agent:
        print(f"Client screener config:")
        print(f"Client screener config: {self.agents_config['client_screener']}")
        return Agent(
            config=self.agents_config["client_screener"],
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def red_flag_checker(self) -> Agent:
        return Agent(
            config=self.agents_config["red_flag_checker"],
            verbose=False,
            allow_delegation=False,
        )

    @task
    def client_screener_task(self) -> Task:
        print(
            f"Client screener task config: {self.tasks_config['client_screener_task']}"
        )
        return Task(
            config=self.tasks_config["client_screener_task"],
            agent=self.client_screener(),
        )

    @task
    def red_flag_check_task(self) -> Task:
        return Task(
            config=self.tasks_config["red_flag_check_task"],
            agent=self.red_flag_checker(),
            output_json=PrescreenResult,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Prescreen Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
            # output_json=PrescreenResult,
        )
