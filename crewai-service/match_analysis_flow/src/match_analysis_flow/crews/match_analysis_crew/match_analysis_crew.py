from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from langchain.chat_models import ChatOpenAI

# from pydantic import BaseModel
from tasks.models import MatchAnalysis

# Purpose of this crew is to take in a candidate CV and job description and return a match analysis
# It will analyze the contents of the job description and compare to the candidate information, and return a match analysis and match strength


# class MatchAnalysis(BaseModel):
#     # data: dict = {}
#     # match_analysis: str = ""
#     # match_strength: str = ""
#     # candidate_data: str = ""
#     # job_info: str = ""
#     # num: int = 0

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.7)


@CrewBase
class MatchAnalysisCrew:
    """Match Analysis Crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def cv_reader(self) -> Agent:
        return Agent(
            config=self.agents_config["cv_reader"],
            # tools=[FileReadTool()],
            verbose=False,
            allow_delegation=False,
        )

    @agent
    def matcher(self) -> Agent:
        return Agent(
            config=self.agents_config["matcher"],
            # tools=[FileReadTool(), CSVSearchTool()],
            verbose=False,
            allow_delegation=False,
            llm=llm,
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
        """Creates the Match Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
        )
