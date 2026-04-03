import os
from sentence_transformers import CrossEncoder

class MyCrossEncoderModel:
    def __init__(self):
        self.model = None
        self.HF_HOME="./models"
        if os.path.exists(f"{self.HF_HOME}/cross-encoder-model"):
            self.load()
        else:
            self.save_model()

    def load(self):
        self.model = CrossEncoder(
            f"{self.HF_HOME}/cross-encoder-model",
            local_files_only=True
        )
       
    def save_model(self):
        self.model = CrossEncoder(
            "cross-encoder/ms-marco-MiniLM-L-6-v2",
            device="cpu"
        )
        self.model.save(f"{self.HF_HOME}/cross-encoder-model")

    def predict(self, text1, text2)-> float:    
        score = self.model.predict([
            (text1, text2),
            (text1, text2),
        ])
        return score[0]
        

        
if __name__ == "__main__":
    cross_encoder_model = MyCrossEncoderModel()
    score = cross_encoder_model.predict("The sky is blue", "Blue is my favorite color")
    print(score)