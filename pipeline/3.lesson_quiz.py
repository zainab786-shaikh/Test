import json
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

from utility import Utility

#------------------- Quiz Template ------------------#
QUIZ_PROMPT_TEMPLATE = """
You are an expert educator. Based on the paragraph provided below, create a high-quality multiple-choice quiz.

Instructions:
1. Create a challenging but fair question based ONLY on the paragraph.
2. Provide exactly 4 distinct options.
3. Identify the correct answer.
4. Provide a student-friendly explanation.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- Quiz Data Model ------------------#
class Quiz(BaseModel):
    question: str = Field(description="The multiple-choice question text.")
    options: List[str] = Field(
        description="A list of exactly 4 options.", 
        min_items=4, 
        max_items=4
    )
    answer: str = Field(description="The correct option string from the options list.")
    answer_embedding: Optional[List[float]] = Field(default=None, description="The embedding vector of the correct answer.")
    explanation: str = Field(description="A brief explanation of why the answer is correct.")

class QuizSet(BaseModel):
    questions: List[Quiz] = Field(description="A list of quiz questions.")
    @field_validator('questions')
    @classmethod
    def check_count(cls, v):
        if len(v) < 5:
            raise ValueError("The set must contain at least 5 questions.")
        return v

class MyLessonQuiz():
    table_name = "multiple_choice_quizzes"

    @classmethod
    def generate_contents(cls, llm,  path, input_content_text) -> QuizSet:
        parser = PydanticOutputParser(pydantic_object=QuizSet)
        prompt = PromptTemplate(
            template=QUIZ_PROMPT_TEMPLATE,
            input_variables=["paragraph"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        # Assuming cls.llm is already initialized as shown in previous turns
        chain = prompt | llm | parser
        response = chain.invoke({"paragraph": input_content_text})

        for question in response.questions:
            question.answer_embedding = Utility.convert_text_to_embedding(question.answer)

        cls.insert_data_db(
            conn=cls.conn, 
            path=path,
            data=response)
        
        return response
    
    @classmethod
    def insert_data_db(cls, conn, path: str, data: QuizSet):
        create_table_query = f"""
        CREATE TABLE IF NOT EXISTS {cls.table_name} (
            id SERIAL PRIMARY KEY,
            path TEXT UNIQUE,
            questions_json JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """

        upsert_query = f"""
        INSERT INTO {cls.table_name} (path, questions_json)
        VALUES (%s, %s)
        ON CONFLICT (path) 
        DO UPDATE SET 
            questions_json = EXCLUDED.questions_json;
        """

        # model_dump() handles the serialization of the float list automatically
        questions_data = [q.model_dump() for q in data.questions]
        
        # Using json.dumps ensures the float precision is handled correctly for JSONB
        values = (path, json.dumps(questions_data))

        try:
            with conn.cursor() as cur:
                cur.execute(create_table_query)
                cur.execute(upsert_query, values)
                conn.commit()
                print(f"Successfully saved Quiz: {path}")
        except Exception as e:
            conn.rollback()
            print(f"Error saving Quiz: {e}")

    @classmethod
    def read_from_db(cls, conn, path: str) -> Optional[QuizSet]:
        query = f"SELECT questions_json FROM {cls.table_name} WHERE path = %s"
        
        try:
            with conn.cursor() as cur:
                cur.execute(query, (path,))
                row = cur.fetchone()
                
                if not row:
                    return None
                
                questions_json = row[0]
                
                # Reconstruct the Quiz object from the stored JSON list
                # This will automatically trigger the check_count validator
                return QuizSet(
                    questions=[Quiz(**q) for q in questions_json]
                )
        except Exception as e:
            print(f"Error reading Quiz: {e}")
            return None