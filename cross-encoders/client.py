# client.py
import requests

url = "http://localhost:4000/compare"

payload = {
    "text1": "The sky is blue",
    "text2": "blue is sky color and my favorite color"
}

response = requests.post(url, json=payload)

print("Status:", response.status_code)
print("Raw response:", response.text)

# only parse JSON if valid
if response.headers.get("content-type", "").startswith("application/json"):
    print(response.json())