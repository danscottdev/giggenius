from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from tasks.models import IntakeAnalysis


@CrewBase
class IntakeAnalysisCrew:

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def technical_intake_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["technical_intake_analyst"],
            # tools=[FileReadTool()],
            verbose=False,
            allow_delegation=False,
        )

    @agent
    def technical_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["technical_analyst"],
            # tools=[FileReadTool()],
            verbose=False,
            allow_delegation=False,
        )

    @task
    def technical_intake_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config["technical_intake_analysis_task"],
            agent=self.technical_intake_analyst(),
            # output_json=IntakeAnalysis,
        )

    @task
    def technical_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config["technical_analysis_task"],
            agent=self.technical_analyst(),
            output_json=IntakeAnalysis,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Intake Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
        )
