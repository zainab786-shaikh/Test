from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import json
import re

from lib.x00_utility import Utility

# ------------------- SHORT QUESTION PROMPT ------------------ #
SHORT_QUESTION_PROMPT_TEMPLATE = """
You are an expert educator.

Your task is to generate short-answer questions STRICTLY following the schema.

RULES:
1. Generate EXACTLY 5 questions.
2. Questions must be open-ended.
3. Each question should cover a different concept.
4. Provide short answers (1-2 sentences).
5. Do NOT add extra fields.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- DATA MODELS ------------------ #
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

# ------------------- MAIN CLASS ------------------ #
class MyLessonShortQuestionGenerator:
    conn = None
    llm = None
    shortq_table = "tenanta.lessonsection_shortquestion"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Short Questions ----------- #
    @classmethod
    async def generate(cls, lessonsection_id: int, section_path: str, section_content: str = ""):
        parser = PydanticOutputParser(pydantic_object=ShortQuestionSet)

        prompt = PromptTemplate(
            template=SHORT_QUESTION_PROMPT_TEMPLATE,
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
                        response = ShortQuestionSet(**raw_json)
                        break
                    except Exception:
                        pass
                raise

        if response is None:
            raise RuntimeError("Failed to generate short questions")

        # for question in response.questions:
        #     embeddings = Utility.convert_text_to_embedding(question.answer)
        #     question.answer_embedding = embeddings.tolist()
            
        questions_data = [q.model_dump() for q in response.questions]
        shortq_id = Utility.insert_data(cls.conn, cls.shortq_table, section_path, json.dumps(questions_data))
        Utility.update_lessonsection(cls.conn, lessonsection_id, section_path, "shortquestionId", shortq_id)

        return response