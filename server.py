from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

# Enable CORS for the Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://dpmpmfkjndabndkcofceepbjkbjdgale"],  # Replace with your extension ID
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Explicitly allow needed methods
    allow_headers=["Content-Type", "Authorization"],  # Allow specific headers
)

class ChatRequest(BaseModel):
    message: str  # Expecting a JSON object with a "message" field

@app.options("/chatbot")  # Explicitly handle OPTIONS preflight requests
async def preflight():
    return {}

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    try:
        # Send the user's message to Ollama's Llama 3 model
        response = ollama.chat(model="llama3", messages=[{"role": "user", "content": request.message}])
        
        # Extract Ollama's response
        bot_reply = response['message']['content']

        return {"response": bot_reply}  # Send the AI response back to the Chrome extension
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)