from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_brain import analyze_text, load_assets


app = FastAPI(title="SentenSafe AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)


@app.on_event("startup")
def startup():
    load_assets()


@app.get("/")
def root():
    return {
        "name": "SentenSafe AI Backend",
        "docs": "/docs",
        "health": "/health",
        "analyze": "/analyze",
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    return analyze_text(request.text)
