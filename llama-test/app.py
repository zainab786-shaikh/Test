import requests
import json
import sys
import time

def generate_with_ollama_stream(prompt, model="llama3.2", host="YOUR_VM_IP_ADDRESS"):
    """
    Generate text using an Ollama model with streaming response.
    
    Args:
        prompt (str): The input text prompt
        model (str): The model name to use
        host (str): The IP address of the VM running Ollama
    """
    url = f"http://{host}:11434/api/generate"
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True
    }
    
    try:
        print("Sending request to Ollama server...")
        start_time = time.time()
        
        # Send the request with stream=True to get the response in chunks
        with requests.post(url, json=payload, stream=True, timeout=10) as response:
            response.raise_for_status()
            
            print("\nReceiving response:")
            print("-" * 50)
            
            full_response = ""
            for line in response.iter_lines():
                if line:
                    # Each line is a JSON object
                    chunk = json.loads(line.decode('utf-8'))
                    
                    # Print the token without a newline and flush to show progress
                    token = chunk.get("response", "")
                    sys.stdout.write(token)
                    sys.stdout.flush()
                    
                    full_response += token
                    
                    # If the model indicates it's done, break the loop
                    if chunk.get("done", False):
                        break
            
            print("\n" + "-" * 50)
            print(f"\nRequest completed in {time.time() - start_time:.2f} seconds")
            return full_response
    
    except requests.exceptions.ConnectionError:
        print("Error: Failed to connect to the Ollama server. Make sure the VM is running, port forwarding is set up correctly, and Ollama is listening on 0.0.0.0.")
        return None
    except requests.exceptions.Timeout:
        print("Error: Request timed out. The connection was established but the server didn't respond in time.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Replace with your VM's IP address
    vm_ip = "127.0.0.1"  # e.g., "192.168.1.100"
    
    user_prompt = "Explain quantum computing in simple terms."
    print(f"Prompt: {user_prompt}")
    
    # Generate response with streaming
    response_text = generate_with_ollama_stream(user_prompt, host=vm_ip)
    
    if response_text:
        print("\nFull response received successfully.")