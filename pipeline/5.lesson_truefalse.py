from pydantic import BaseModel, Field, field_validator
import json
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

from utility import Utility

#------------------- True/False Quiz Template ------------------#
TF_QUIZ_PROMPT_TEMPLATE = """
You are an expert tutor. Based on the paragraph below, create a series of True/False questions.

Rules:
1. Each question must be a clear statement.
2. The answer must be either "True" or "False".
3. Provide a clear explanation for the answer based strictly on the text.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- True/False Quiz Data Model ------------------#
class TrueFalseQuestion(BaseModel):
    question: str = Field(description="A factual statement to be evaluated as True or False.")
    options: List[str] = Field(
        default=["True", "False"], 
        description="The options for the question (Always True and False)."
    )
    answer: str = Field(description="The correct answer, must be exactly 'True' or 'False'.")
    answer_embedding: Optional[List[float]] = Field(default=None, description="The embedding vector of the correct answer.")

    @field_validator('answer')
    @classmethod
    def validate_answer(cls, v):
        if v not in ["True", "False"]:
            raise ValueError("Answer must be either 'True' or 'False'")
        return v

class TrueFalseSet(BaseModel):
    questions: List[TrueFalseQuestion] = Field(description="A list of true/false questions.")

    @field_validator('questions')
    @classmethod
    def check_count(cls, v):
        if len(v) < 5:
            raise ValueError("The set must contain at least 5 questions.")
        return v

class MyLessonTrueFalse():
    table_name = "true_false_questions"

    @classmethod
    def generate_contents(cls, llm, path, input_content_text) -> TrueFalseSet:
        parser = PydanticOutputParser(pydantic_object=TrueFalseSet)
        prompt = PromptTemplate(
            template=TF_QUIZ_PROMPT_TEMPLATE,
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
    def insert_data_db(cls, conn, path: str, data: TrueFalseSet):
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
                print(f"Successfully saved True/False questions: {path}")
        except Exception as e:
            conn.rollback()
            print(f"Error saving True/False: {e}")

    @classmethod
    def read_from_db(cls, conn, path: str) -> TrueFalseSet:
        query = f"SELECT questions_json FROM {cls.table_name} WHERE path = %s"
        
        try:
            with conn.cursor() as cur:
                cur.execute(query, (path,))
                row = cur.fetchone()
                
                if not row:
                    return None # Or an empty TrueFalseSet(questions=[])
                
                questions_json = row[0]
                
                # Reconstruct the ShortQuestionSet object
                # This will automatically trigger the check_count validator
                return TrueFalseSet(
                    questions=[TrueFalseQuestion(**q) for q in questions_json]
                )
        except Exception as e:
            print(f"Error reading True/False: {e}")
            return None