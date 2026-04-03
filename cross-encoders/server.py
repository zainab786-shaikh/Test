# server.py
from flask import Flask, request, jsonify
from sentence_transformers import CrossEncoder
from cross_encoders import MyCrossEncoderModel


app = Flask(__name__)
model = MyCrossEncoderModel()

@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    text1 = data.get("text1", "")
    text2 = data.get("text2", "")

    score = model.predict(text1, text2)
    match = bool(score > 0.85)  # ensure python bool
    return jsonify({
        "match": match,
        "score": float(score)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)