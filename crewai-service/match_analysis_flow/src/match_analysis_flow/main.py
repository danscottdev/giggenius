#!/usr/bin/env python
import json

from crewai.flow.flow import Flow, listen, start
from pydantic import BaseModel

from .crews.match_analysis_crew.match_analysis_crew import MatchAnalysisCrew
from .crews.prescreen_crew.prescreen_crew import PrescreenCrew


class LeadScoringState(BaseModel):
    match_analysis: str = ""
    match_strength: str = ""
    candidate_data: str = ""
    job_info: str = ""
    red_flag_criteria: str = ""
    red_flag_violation: bool = False
    red_flag_analysis: str = ""
    client_info: str = ""
    client_score: int = 0
    client_analysis: str = ""


class LeadScoringFlow(Flow[LeadScoringState]):
    def pre_kickoff(self, inputs):
        ## Due to crewAI flow existing within broader python async code, we need to use this to pre-kickoff the flow to set the state
        ## Probably a better way to refactor this. But this works for now.
        # print(f"Pre-kickoff inputs: {inputs}")
        print("--------")
        # Print typeof client_info
        print(f"TYPE Client info: {type(inputs['client_info'])}")
        print(f"Client info: {inputs['client_info']}")
        print("--------")

        if inputs is not None:
            self._initialize_state(inputs)
            self.state.candidate_data = inputs["candidate_data"]
            self.state.job_info = inputs["job_info"]
            self.state.red_flag_criteria = inputs["red_flag_criteria"]
            self.state.client_info = inputs["client_info"]

    @start()
    def prescreen(self):
        print("Running prescreen...")
        print(f"State: {self.state}")
        print(f"Client info type: {type(self.state.client_info)}")
        print(f"Client info: {self.state.client_info}")

        # Run prescreen
        red_flag_analysis_inputs = {
            "red_flag_criteria": self.state.red_flag_criteria,
            "job_info": self.state.job_info,
            "client_info": self.state.client_info,
        }

        print(f"Red flag analysis inputs: {red_flag_analysis_inputs}")

        result = PrescreenCrew().crew().kickoff(inputs=red_flag_analysis_inputs)
        print(f"Prescreen result: {result}")

        self.state.red_flag_violation = result["red_flag_violation"]
        self.state.red_flag_analysis = result["red_flag_analysis"]
        self.state.client_score = result["client_score"]
        self.state.client_analysis = result["client_analysis"]

    @listen(prescreen)
    def run_match_analysis(self):
        print("Running match analysis...")
        print(f"State: {self.state}")

        if self.state.red_flag_violation:
            print("Red flag violation detected, skipping match analysis")
            self.state.match_strength = "-1"
            self.state.match_analysis = "AUTO-VETO: " + self.state.red_flag_analysis
            return

        analysis_input = {
            "candidate_data": self.state.candidate_data,
            "job_info": self.state.job_info,
        }
        result = MatchAnalysisCrew().crew().kickoff(inputs=analysis_input)

        print("Match analysis generated", result)

        self.state.match_analysis = result["match_analysis"]
        self.state.match_strength = result["match_strength"]

    @listen(run_match_analysis)
    def next_steps_placeholder(self):
        print("Placeholder for next steps to run after initial match analysis...")
        print(f"FINAL State: {self.state}")

        # Return JSON object with match_analysis and match_strength
        return {
            "match_analysis": self.state.match_analysis,
            "match_strength": self.state.match_strength,
            "client_score": self.state.client_score,
            "client_analysis": self.state.client_analysis,
        }


async def crew_kickoff(data):
    lead_scoring_flow = LeadScoringFlow()
    lead_scoring_flow.pre_kickoff(inputs=data)
    result = await lead_scoring_flow.kickoff_async()
    print(f"CREW Result: {result}")
    return result
