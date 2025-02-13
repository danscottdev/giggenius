from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_service.logger import logger
from crewai_tools import CSVSearchTool, FileReadTool
from pydantic import BaseModel
from tasks.models import MatchAnalysis

# class MatchAnalysis(BaseModel):
#     job_title: str
#     match_strength: str
#     match_analysis: str


@CrewBase
class MatchToProposalCrew:
    logger.info("MatchToProposalCrew")
    """MatchToProposal crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def cv_reader(self) -> Agent:
        return Agent(
            config=self.agents_config["cv_reader"],
            tools=[FileReadTool()],
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def matcher(self) -> Agent:
        return Agent(
            config=self.agents_config["matcher"],
            tools=[FileReadTool(), CSVSearchTool()],
            verbose=True,
            allow_delegation=False,
        )

    @task
    def read_cv_task(self) -> Task:
        return Task(config=self.tasks_config["read_cv_task"], agent=self.cv_reader())

    @task
    def match_cv_task(self) -> Task:
        return Task(
            config=self.tasks_config["match_cv_task"],
            agent=self.matcher(),
            output_json=MatchAnalysis,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the MatchToProposal crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=2,
            # process=Process.hierarchical, # In case you want to use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
