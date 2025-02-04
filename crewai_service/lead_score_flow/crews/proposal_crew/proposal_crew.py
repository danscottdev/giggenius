from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

# from pydantic import BaseModel
from tasks.models import Proposal

# Purpose of this crew is to generate a proposal/cover letter for a job
# It will take in the job description and the candidate's resume and generate a proposal/cover letter
# It will also take into account user-provided preferences for the proposal/cover letter


@CrewBase
class ProposalCrew:
    """Proposal Crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def proposal_generator(self) -> Agent:
        print(f"Proposal generator config:")
        print(f"Proposal generator config: {self.agents_config['proposal_generator']}")
        return Agent(
            config=self.agents_config["proposal_generator"],
            verbose=True,
            allow_delegation=False,
        )

    @task
    def proposal_generator_task(self) -> Task:
        print(
            f"Proposal generator task config: {self.tasks_config['proposal_generator_task']}"
        )
        return Task(
            config=self.tasks_config["proposal_generator_task"],
            agent=self.proposal_generator(),
            output_json=Proposal,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Proposal Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
            # output_json=PrescreenResult,
        )
