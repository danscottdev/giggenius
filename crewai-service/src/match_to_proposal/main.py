#!/usr/bin/env python
# import sys

from src.match_to_proposal.crew import MatchToProposalCrew


def run(job):

    parsed_job = {
        "title": job["upwk_title"],
        "description": job["upwk_description"],
    }
    print(parsed_job)

    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    inputs = {
        "path_to_jobs_csv": "./src/match_to_proposal/data/jobs.csv",
        "path_to_cv": "./src/match_to_proposal/data/cv.md",
        "job_info": f"JOB TITLE: {parsed_job['title']}\n\nJOB DESCRIPTION: {parsed_job['description']}",  # Add the job JSON object to the inputs
    }
    print(inputs)

    result = MatchToProposalCrew().crew().kickoff(inputs=inputs)
    return result
