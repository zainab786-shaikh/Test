import axios from "axios";
import { IContext, IMessage } from "./0.model";
import { IServiceChat } from "./3.service.model";

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

interface OllamaStreamResponse {
  response: string;
  done: boolean;
}

export class ServiceChatImpl implements IServiceChat {
  private ollamaHost: string;
  private ollamaPort: string;
  private ollamaModel: string;

  constructor() {
    // Read from environment or use defaults
    this.ollamaHost = process.env.OLLAMA_HOST || "localhost";
    this.ollamaPort = process.env.OLLAMA_PORT || "11434";
    this.ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
  }

  async create(inChatInfo: IContext): Promise<IMessage | null> {
    const url = `http://${this.ollamaHost}:${this.ollamaPort}/api/generate`;

    // Build context-aware prompt
    const userMessage = inChatInfo.messages
      .filter(msg => msg.isUser)
      .pop()?.content || "";

    const contextPrompt = inChatInfo.explanation
      ? `Context: ${inChatInfo.explanation}\n\nStudent Question: ${userMessage}`
      : userMessage;

    try {
      const response = await axios.post<OllamaStreamResponse>(
        url,
        {
          model: this.ollamaModel,
          prompt: contextPrompt,
          stream: false, // Non-streaming for initial implementation
        } as OllamaRequest,
        {
          timeout: 60000, // 60 second timeout for AI responses
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        content: response.data.response || "I'm having trouble generating a response.",
        isUser: false,
      };
    } catch (error: any) {
      console.error("Ollama API Error:", error.message);

      // Provide helpful error messages
      if (error.code === "ECONNREFUSED") {
        return {
          content: "Unable to connect to the AI assistant. Please ensure Ollama is running on port " + this.ollamaPort + ".",
          isUser: false,
        };
      } else if (error.code === "ETIMEDOUT") {
        return {
          content: "The AI assistant is taking too long to respond. Please try again.",
          isUser: false,
        };
      } else if (error.response?.status === 404) {
        return {
          content: "The AI model '" + this.ollamaModel + "' is not available. Please check if it's installed in Ollama.",
          isUser: false,
        };
      }

      return {
        content: "Sorry, I encountered an error while processing your question. Please try again later.",
        isUser: false,
      };
    }
  }
}
