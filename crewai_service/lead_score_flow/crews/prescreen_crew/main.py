#!/usr/bin/env python
import sys
import warnings

from lead_score_flow.crews.prescreen_crew.prescreen_crew import PrescreenCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information


def run():
    """
    Run the crew.
    """
    inputs = {"topic": "AI LLMs"}
    PrescreenCrew().crew().kickoff(inputs=inputs)


def train():
    """
    Train the crew for a given number of iterations.
    """
    # inputs = {"topic": "AI LLMs"}
    inputs = {
        "client_info": "CLIENT LOCATION: United States CLIENT RATING: Rating is 0 out of 5. CLIENT TOTAL SPEND: $0 CLIENT PAYMENT VERIFIED?: Payment verified",
        "job_info": "JOB TITLE: Website design via godaddy wordpress JOB DESCRIPTION: Website design using Godaddy wordpress platform using existing templates or paid depending on requirements/limitations of wordpress via godaddy. We will provide all images,logos and content but open to suggestions as to what we should have. looking for landing page, product page, services, media (images/videos), request a quote, and contact. will provide example sites and SEO a plus.",
        "red_flag_criteria": "- No jobs that are not explicitly considered 'web development' or 'software engineering' in nature; - No jobs that have vague or incomplete descriptions. If the job description does not provide enough information for an experienced web developer to understand the job requirements, veto the job; - No jobs that require a heavy emphasis on design; - No jobs that require an entire website to be built from scratch; - No jobs where the sole focus is on using visual pagebuilders like Elementor or Divi. Do not veto a job just for including a reference to Elementor, but only veto the job if Elementor seems to be the main aspect of it; - No jobs that require knowledge of GoHighLevel;",
    }

    filename = "your_model.pkl"
    n_iterations = 1

    try:
        PrescreenCrew().crew().train(
            n_iterations=n_iterations, filename=filename, inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        PrescreenCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        PrescreenCrew().crew().test(
            n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
