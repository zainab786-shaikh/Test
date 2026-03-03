import asyncio

from scipy.io.wavfile import write
from sentence_transformers import SentenceTransformer, util
from data_ingestor import DataIngestor
from completed.lesson_quiz import MyLessonQuiz
from voice_engine import VoiceEngine


class VoiceQuizEngine:
    # Smallest, high-performance embedding model
    embed_model = SentenceTransformer('all-MiniLM-L6-v2') 

    @classmethod
    async def run_quiz(cls, conn, path: str):
        # 1. Retrieve Quiz from DB using your existing MyLessonQuiz class
        quiz_data = MyLessonQuiz.read_from_db(conn, path)
        if not quiz_data:
            print("No quiz found!")
            return

        for idx, q in enumerate(quiz_data.questions):
            # 2. Narrate Question and Options
            options_text = ". ".join([f"Option {i+1}: {opt}" for i, opt in enumerate(q.options)])
            full_prompt = f"Question {idx+1}: {q.question}. The options are: {options_text}. Please say the correct answer now."
            print(full_prompt)
            await VoiceEngine.speak(full_prompt)

            # 3. Capture and Transcribe Student Voice
            student_answer_text = VoiceEngine.listen()
            print(f"You said: {student_answer_text}")

            # 4. Compare using Semantic Similarity (Embeddings)
            # We compare the student's voice text to the correct answer string
            emb1 = cls.embed_model.encode(student_answer_text, convert_to_tensor=True)
            emb2 = cls.embed_model.encode(q.answer, convert_to_tensor=True)
            
            cosine_score = util.cos_sim(emb1, emb2).item()
            print(f"Match Score: {cosine_score:.2f}")

            # 5. Determine Result (Threshold 0.75-0.8 is usually safe)
            if cosine_score > 0.8:
                await VoiceEngine.speak(f"Correct! {q.explanation}")
            else:
                await VoiceEngine.speak(f"Not quite. The correct answer was {q.answer}. {q.explanation}")

            print("-" * 30)

if __name__ == "__main__":
    db_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "postgres",
        "host": "localhost"
    }
    ingestor = DataIngestor(db_params)
    
    input_paragraph = """
    Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. 
    During photosynthesis, plants take in carbon dioxide from the air and water from the soil. 
    Using the energy from sunlight, they convert these into glucose, a type of sugar that provides energy and growth material for the plant. 
    Oxygen is released as a byproduct of this process, which is essential for the survival of most living organisms on Earth. 
    Photosynthesis not only sustains the plant itself but also forms the base of the food chain for many ecosystems.
    """
    #content = LLM_Wrappper.get_contents(input_paragraph, ingestor)
    #asyncio.run(LLM_Wrappper.run_lesson_narration(ingestor.get_connection(), "L1.S1.P1"))
    asyncio.run(VoiceQuizEngine.run_quiz(ingestor.get_connection(), "L1.S1.P1"))

    ingestor.close()

