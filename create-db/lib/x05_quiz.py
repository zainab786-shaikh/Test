from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import json
import re

from lib.x00_utility import Utility

# ------------------- QUIZ PROMPT ------------------ #
QUIZ_PROMPT_TEMPLATE = """
You are an expert educator.

Your task is to generate a multiple-choice quiz STRICTLY following the schema.

RULES (VERY IMPORTANT):
1. Generate EXACTLY 5 questions.
2. Each question MUST contain EXACTLY 4 options.
3. Options MUST be short phrases.
4. The "answer" MUST be EXACTLY one of the 4 options.
5. NEVER generate more than 4 options.
6. NEVER omit the fields: question, options, answer, explanation.
7. Do NOT add extra fields.
8. Output ONLY valid JSON.

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

# ------------------- MAIN CLASS ------------------ #
class MyLessonQuizGenerator:
    conn = None
    llm = None
    quiz_table = "tenanta.lessonsection_quiz"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Quiz ----------- #
    @classmethod
    async def generate(cls, lesson_section_id: int, section_path: str, section_content: str = "") -> QuizSet:
        parser = PydanticOutputParser(pydantic_object=QuizSet)

        prompt = PromptTemplate(
            template=QUIZ_PROMPT_TEMPLATE,
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
                        response = QuizSet(**raw_json)
                        break
                    except Exception:
                        pass
                raise

        if response is None:
            raise RuntimeError("Failed to generate quiz")
        
        # for question in response.questions:
        #     embeddings = Utility.convert_text_to_embedding(question.answer)
        #     question.answer_embedding = embeddings.tolist()

        questions_data = [q.model_dump() for q in response.questions]
        
        quiz_id = Utility.insert_data(cls.conn, cls.quiz_table, section_path, json.dumps(questions_data))
        Utility.update_lessonsection(cls.conn, lesson_section_id, section_path, "quizId", quiz_id)

        return response