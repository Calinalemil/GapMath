from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
from database import init_db
from models import save_session

 # Load enviroment variable from .env file
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Initialize database
init_db()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini (free-tier keys: use gemini-3.5-flash or gemini-flash-latest)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
client = genai.GenerativeModel(model_name)

# Data Model
class ExerciseRequest(BaseModel):
    exercise: str    # str = string
    grade: str
    image: str = None # optional - only if student uploads image

# Routes
@app.get("/")
def root():
    return {"message": "GapMath API is running!"}

@app.post("/analyze")
async def analyze(request: ExerciseRequest):

    # Build the prompt
    prompt = f"""you are a math education expert.
  A {request.grade} student submittied this math exercise:

  {request.exercise}

  Analyze it and return ONLY a JSON object with this structure:
  {{
    "score": <integer 0-100>,
    "summary": "<2-3 sentence overview>",
    "gaps": [
      {{
        "concept": "<gap name>",
        "severity": "critical|moderate|minor",
        "description": "<1-2 sentences>",
        "hint": "<friendly actionable tip>",
        "example": "<a short worked example that demostrates the correct concept>"
      }}
    ],
  "nextSteps": [
    {{
      "title": "<short action title>",
      "detail": "<specific practice suggestion>",
      "exercise": "<one concrete practice problem the student can try right now>"
    }}
    ]
  }}
  Rules:
  - If exercise is fully correct return score: 100, empty gaps [], encouraging summary
  - Gaps: 2-4 items ordered by severity
  - nextSteps: 3 items from basic to advanced
  - Each gap MUST include an "example" field - never leave it empty
  - Each next step MUST include "exercise" field - never leave it empty
  - Write all math expressions in plain text, not LaTeX. 
  - Use x^2 instead of $x^2$, and (x-3)(x+1) instead of $(x-3)(x+1)$
  - Never use $ signs for math notation 
  - Explain at {request.grade} level
  - Return ONLY valid JSON, no extra text"""

    # Call Gemini API
    response = client.generate_content(prompt)

    # Extract and return the result
    raw = response.text
    clean = raw.replace('```json', '').replace('```', '').strip()
    parsed = json.loads(clean)

    # Save to database
    save_session(
        exercise=request.exercise,
        grade=request.grade,
        score=parsed['score'],
        summary=parsed['summary'],
        gaps=parsed['gaps'],
        next_steps=parsed['nextSteps']
    ) 

    return {"result": raw}