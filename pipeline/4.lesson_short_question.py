import json
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

from utility import Utility

#------------------- Short Questions Template ------------------#
SHORT_QUESTION_PROMPT_TEMPLATE = """
You are an expert tutor. Based on the paragraph below, create exactly 5 diverse short-answer questions.

Instructions:
1. Questions should be open-ended (Avoid Yes/No).
2. Each question should test a different detail or concept from the text.
3. Provide a 'sample_answer' that is concise and accurate.
4. Keep the language simple and student-friendly.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- Short Questions Data Model ------------------#
class ShortQuestion(BaseModel):
    question: str = Field(description="A clear, concise open-ended question.")
    answer: str = Field(description="A 1-2 sentence ideal answer based on the text.")
    answer_embedding: Optional[List[float]] = Field(default=None, description="The embedding vector of the correct answer.")

class ShortQuestionSet(BaseModel):
    questions: List[ShortQuestion] = Field(description="A list of short-answer questions.")

    @field_validator('questions')
    @classmethod
    def check_count(cls, v):
        if len(v) < 5:
            raise ValueError("The set must contain at least 5 questions.")
        return v

class MyLessonShortQuestion():
    table_name = "short_answer_questions"

    @classmethod
    def generate_contents(cls, llm, path, input_content_text) -> ShortQuestionSet:
        parser = PydanticOutputParser(pydantic_object=ShortQuestionSet)
        prompt = PromptTemplate(
            template=SHORT_QUESTION_PROMPT_TEMPLATE,
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
    def insert_data_db(cls, conn, path: str, data: ShortQuestionSet):
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
                print(f"Successfully saved Short Questions: {path}")
        except Exception as e:
            conn.rollback()
            print(f"Error saving Short Questions: {e}")

    @classmethod
    def read_from_db(cls, conn, path: str) -> Optional[ShortQuestionSet]:
        query = f"SELECT questions_json FROM {cls.table_name} WHERE path = %s"
        
        try:
            with conn.cursor() as cur:
                cur.execute(query, (path,))
                row = cur.fetchone()
                
                if not row:
                    return None # Or an empty ShortQuestionSet(questions=[])
                
                questions_json = row[0]
                
                # Reconstruct the ShortQuestionSet object
                # This will automatically trigger the check_count validator
                return ShortQuestionSet(
                    questions=[ShortQuestion(**q) for q in questions_json]
                )
        except Exception as e:
            print(f"Error reading Short Questions: {e}")
            return None