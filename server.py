from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama

app = FastAPI()

# Define the request structure
class ChatRequest(BaseModel):
    message: str  # Expecting a JSON object with a "message" field

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    try:
        # Process the user's message using the Ollama AI model
        response = ollama.chat(model="llama3", messages=[{"role": "user", "content": request.message}])

        # Extract the chatbot's response
        chatbot_reply = response['message']['content']
        
        return {"response": chatbot_reply}  # Send response back to the extension
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
