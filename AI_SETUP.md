# AI Assistant Setup & Testing Guide

## Prerequisites

1. **Install Ollama**
   - Download from: https://ollama.ai
   - Install for your platform (Windows/Mac/Linux)

2. **Pull the Llama 3.2 model**
   ```bash
   ollama pull llama3.2
   ```

3. **Start Ollama server**
   ```bash
   ollama serve
   ```
   
   This should start Ollama on `http://localhost:11434`

## Testing the AI Integration

### Test Ollama directly
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "What is the greenhouse effect?",
  "stream": false
}'
```

### Test the backend API

1. **Start the backend server**
   ```bash
   cd server
   npm install  # Install dependencies (including axios)
   npm run build
   npm start
   ```

2. **Use the provided REST file**
   Open `server/src/8.chat/8.test.rest` in VS Code with REST Client extension installed.
   
   Click "Send Request" on any of the test scenarios.

3. **Expected Response**
   ```json
   {
     "content": "The greenhouse effect is a natural process...[AI generated response]",
     "isUser": false
   }
   ```

## Troubleshooting

### Error: "Unable to connect to the AI assistant"
- Ensure Ollama is running: `ollama serve`
- Check if port 11434 is accessible: `netstat -an | grep 11434`

### Error: "The AI model 'llama3.2' is not available"
- Pull the model: `ollama pull llama3.2`
- List available models: `ollama list`

### Error: "The AI assistant is taking too long to respond"
- The model might be loading for the first time (can take 30-60 seconds)
- Try again after the model is fully loaded
- Check system resources (Ollama requires sufficient RAM)

## Environment Configuration

Edit `server/.env` to customize AI settings:

```env
OLLAMA_HOST=localhost
OLLAMA_PORT=11434
OLLAMA_MODEL=llama3.2
```

## Next Steps

Once verified, the AI Assistant will be available in:
- **Frontend**: Lesson Explanation phase (`9.evaluation/2.explanation`)
- **Endpoint**: `POST /chat`
- **Feature**: Students can ask questions about lesson content in real-time
