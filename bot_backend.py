from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# QUANTITATIVE KNOWLEDGE BASE (Updated with 30+ Academic Projects)
KNOWLEDGE_BASE = {
    "identity": "Owner: Rachana Hinge. Built me.",
    "experience": "1.5+ Years of Lead AI Research & Industrial Residency.",
    "project_count": "3+ Production Core Projects & 30+ Academic/Self-Led AI projects.",
    "project_list": "Major: BhaktiWaani (Vani AI), Agentic RAG Platform, IEEE Clinical AI. Plus 30+ Academic builds.",
    "mission": "Architecting Production-Ready RAG & Agentic Systems.",
    "education": "B.Tech @ DESPU. GPA: 8.2.",
    "research": "Lead @ IEEE EMBS. Transformer Reliability focus.",
    "skills": "RAG, Agentic AI, Medical NLP, Python, R, AWS, Azure.",
    "certs": "7+ Professional Credentials (AWS, Microsoft, Honeywell Gladys).",
    "location": "Pune, India.",
    "contact": "rachanahinge123@gmail.com | +91 7498425211."
}

class ChatQuery(BaseModel):
    message: str

def generate_crisp_response(user_input: str) -> str:
    """
    QUANTITATIVE CRISP ENGINE - Numeric First.
    """
    q = user_input.lower()
    
    # 1. GREETINGS & IDENTITY
    if any(k in q for k in ["hi", "hey", "hello"]): return "Rachu Ai how may i hep u"
    if any(k in q for k in ["who are you", "who r u"]): return "Rachu Ai how may i hep u"
    if any(k in q for k in ["made you", "owner", "creator", "built you", "build you"]): return "Rachana Hinge Built me."

    # 2. NUMERIC QUERIES
    if "how many" in q or "numbers" in q:
        if "project" in q: return KNOWLEDGE_BASE["project_count"]
        if "year" in q or "exp" in q: return KNOWLEDGE_BASE["experience"]
        if "cert" in q or "credential" in q: return KNOWLEDGE_BASE["certs"]

    # 3. DIRECT DATA
    if any(k in q for k in ["experience", "experiance", "year"]): return KNOWLEDGE_BASE["experience"]
    if any(k in q for k in ["project", "built", "build"]): return KNOWLEDGE_BASE["project_list"]
    if any(k in q for k in ["skill", "tech", "know", "ml", "ai"]): return KNOWLEDGE_BASE["skills"]
    if any(k in q for k in ["study", "education", "gpa"]): return KNOWLEDGE_BASE["education"]
    if any(k in q for k in ["contact", "mail", "phone"]): return KNOWLEDGE_BASE["contact"]
    if any(k in q for k in ["bhakti", "sanskrit", "vani"]): return KNOWLEDGE_BASE["project_list"]

    return "Data limit. Ask for Rachana's RAG, AI Research, or Contact."

@app.post("/chat")
async def chat_endpoint(query: ChatQuery):
    try:
        response = generate_crisp_response(query.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
