from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://dpmpmfkjndabndkcofceepbjkbjdgale"],  # Allow your Chrome extension
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    return {"response": f"You said: {request.message}"}  # Echo user input

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)