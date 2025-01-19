#!/usr/bin/env python
from crewai.flow.flow import Flow, listen, start
from pydantic import BaseModel

from .crews.match_analysis_crew.match_analysis_crew import MatchAnalysisCrew


class LeadScoringState(BaseModel):
    data: dict = {}
    match_analysis: str = ""
    match_strength: str = ""
    candidate_data: str = ""
    job_info: str = ""
    num: int = 0


class LeadScoringFlow(Flow[LeadScoringState]):
    def pre_kickoff(self, inputs):
        ## Due to crewAI flow existing within broader python async code, we need to use this to pre-kickoff the flow to set the state
        ## Probably a better way to refactor this. But this works for now.
        print(f"Pre-kickoff inputs: {inputs}")

        if inputs is not None:
            self._initialize_state(inputs)
            self.state.candidate_data = inputs["data"]["candidate_data"]
            self.state.job_info = inputs["data"]["job_info"]

        print(f"State: {self.state}")

    @start()
    def run_match_analysis(self):
        print("Running match analysis")
        analysis_input = {
            "candidate_data": self.state.candidate_data,
            "job_info": self.state.job_info,
        }
        result = MatchAnalysisCrew().crew().kickoff(inputs=analysis_input)

        print("Match analysis generated", result.raw)
        self.state.match_analysis = result.raw

    @listen(run_match_analysis)
    def next_steps_placeholder(self):
        print("Placeholder for next steps to run after initial match analysis...")


async def crew_kickoff(data):
    lead_scoring_flow = LeadScoringFlow()
    lead_scoring_flow.pre_kickoff(inputs=data)
    result = await lead_scoring_flow.kickoff_async()
    print(f"CREW Result: {result}")
    return result
