# crewai-service/api_server.py
import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.match_to_proposal.main import run

app = FastAPI()

origins = [
    "http://localhost:3000",  # Local development
    # "https://your-production-url.com", # Production URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Your Next.js app URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],  # Allows all headers
)


@app.post("/trigger")
async def trigger(request: Request):
    # Call the run function from main.py
    try:
        data = await request.json()
        # print(data)
        output = run(data)
        return {"status": "success", "output": output}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# To run the server, use: uvicorn api_server:app --reload
