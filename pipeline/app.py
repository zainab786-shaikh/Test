import json
from edge_tts import communicate
import edge_tts
from langchain_ollama import OllamaLLM

from data_ingestor import DataIngestor
from lesson_content import MyLessonContent
from completed.lesson_match_column import MyLessonMatchColumn
from completed.lesson_quiz import MyLessonQuiz
from completed.lesson_short_question import MyLessonShortQuestion
from completed.lesson_truefalse import MyLessonTrueFalse

import asyncio
import os
import platform

class LLM_Wrappper:
    
    @classmethod
    def __init__(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn
        
    @classmethod
    async def generate_contents(cls, 
                            path: str, 
                            input_content_text: str
                            ) -> str:
        content = MyLessonContent()
        content.initialize(cls.llm, cls.conn)
        content_response = await content.generate_contents(
            path, 
            input_content_text)
        print("Lesson Content Response:", content_response.summary)
        
    @classmethod
    async def display_contents(cls, 
                           path: str) -> str:
        content = MyLessonContent()
        content.initialize(cls.llm, cls.conn)
        content_response = await content.display_contents(path)
        print("Lesson Content Response:", content_response.summary)

async def get_and_store_information(LLM_Wrappper, db_params):
    model_name = "ministral-3:3b"
    llm = OllamaLLM(model=model_name, format="json", temperature=0)
    
    ingestor = DataIngestor(db_params)
    conn = ingestor.get_connection()
    llm_wrapper = LLM_Wrappper(llm=llm, conn=conn)
    
    path="L1.S1.P1"
    input_content_text = """
    Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. 
    During photosynthesis, plants take in carbon dioxide from the air and water from the soil. 
    Using the energy from sunlight, they convert these into glucose, a type of sugar that provides energy and growth material for the plant. 
    Oxygen is released as a byproduct of this process, which is essential for the survival of most living organisms on Earth. 
    Photosynthesis not only sustains the plant itself but also forms the base of the food chain for many ecosystems.
    """
    # content = await llm_wrapper.generate_contents(
    #     path, 
    #     input_content_text)
    
    content = await llm_wrapper.display_contents(
        path)
    #asyncio.run(llm_wrapper.run_lesson_narration(ingestor.get_connection(), "L1.S1.P1"))

    ingestor.close()

if __name__ == "__main__":
    db_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "postgres",
        "host": "localhost"
    }
    asyncio.run(get_and_store_information(LLM_Wrappper, db_params))
    
    
