import express, { Request, Response } from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Function to generate text using Ollama with streaming
async function generateWithOllamaStream(prompt: string, model: string = "llama3.2", host: string): Promise<string | null> {
    const url = `http://${host}:11434/api/generate`;
    const payload = {
        model,
        prompt,
        stream: true
    };

    try {
        console.log("Sending request to Ollama server...");
        const startTime = Date.now();

        const response = await axios.post(url, payload, { responseType: "stream", timeout: 10000 });

        console.log("\nReceiving response:");
        console.log("-".repeat(50));

        let fullResponse = "";
        
        response.data.on("data", (chunk: Buffer) => {
            const lines = chunk.toString().split("\n");
            lines.forEach(line => {
                if (line) {
                    try {
                        const json = JSON.parse(line);
                        const token = json.response || "";
                        process.stdout.write(token);
                        fullResponse += token;
                    } catch (error) {
                        console.error("Error parsing chunk", error);
                    }
                }
            });
        });
        
        return new Promise(resolve => {
            response.data.on("end", () => {
                console.log("\n" + "-".repeat(50));
                console.log(`\nRequest completed in ${(Date.now() - startTime) / 1000} seconds`);
                resolve(fullResponse);
            });
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNREFUSED") {
                console.error("Error: Failed to connect to the Ollama server. Make sure the VM is running and accessible.");
            } else if (error.code === "ETIMEDOUT") {
                console.error("Error: Request timed out.");
            } else {
                console.error("Error: ", error.message);
            }
        }
        return null;
    }
}

// API route to generate text
app.post("/generate", async (req: Request, res: Response) => {
    const { prompt, model, host } = req.body;
    if (!prompt || !host) {
        return res.status(400).json({ error: "Prompt and host are required." });
    }
    
    const responseText = await generateWithOllamaStream(prompt, model, host);
    if (responseText) {
        res.json({ response: responseText });
    } else {
        res.status(500).json({ error: "Failed to generate response." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
