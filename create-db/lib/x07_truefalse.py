from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import json
import re

from lib.x00_utility import Utility

# ------------------- TRUE/FALSE PROMPT ------------------ #
TF_QUIZ_PROMPT_TEMPLATE = """
You are an expert educator.

Your task is to generate True/False questions STRICTLY following the schema.

RULES:
1. Generate EXACTLY 5 questions.
2. Each must be a statement.
3. Answer must be "True" or "False".
4. Keep language simple.
5. Do NOT add extra fields.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- DATA MODELS ------------------ #
class TrueFalseQuestion(BaseModel):
    question: str
    options: List[str] = Field(default=["True", "False"])
    answer: str

    @field_validator("answer")
    @classmethod
    def validate_answer(cls, v):
        if v not in ["True", "False"]:
            raise ValueError("Answer must be True or False")
        return v

class TrueFalseSet(BaseModel):
    questions: List[TrueFalseQuestion]

    @field_validator("questions")
    @classmethod
    def validate_count(cls, v):
        if len(v) < 5:
            raise ValueError("Minimum 5 questions required")
        return v

# ------------------- MAIN CLASS ------------------ #
class MyLessonTrueFalseGenerator:
    conn = None
    llm = None
    tf_table = "tenanta.lessonsection_truefalse"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate True/False ----------- #
    @classmethod
    async def generate(cls, lesson_section_id: int, section_path: str, section_content: str = ""):
        parser = PydanticOutputParser(pydantic_object=TrueFalseSet)

        prompt = PromptTemplate(
            template=TF_QUIZ_PROMPT_TEMPLATE,
            input_variables=["paragraph"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | cls.llm | parser

        max_attempts = 3
        response = None

        for attempt in range(1, max_attempts + 1):
            try:
                response = await chain.ainvoke({"paragraph": section_content})
                break
            except OutputParserException:
                if attempt < max_attempts:
                    continue

                raw_json = Utility.extract_json(e)
                if raw_json:
                    try:
                        response = TrueFalseSet(**raw_json)
                        break
                    except Exception:
                        pass
                raise

        if response is None:
            raise RuntimeError("Failed to generate true/false questions")

        questions_data = [q.model_dump() for q in response.questions]
        truefalse_id = Utility.insert_data(cls.conn, cls.tf_table, section_path, json.dumps(questions_data))
        Utility.update_lessonsection(cls.conn, lesson_section_id, section_path, "truefalseId", truefalse_id)

        return response