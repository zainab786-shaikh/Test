from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import json
import re

from lib.x00_utility import Utility

# ------------------- FILL IN THE BLANKS PROMPT ------------------ #
FILLBLANKS_PROMPT_TEMPLATE = """
You are an expert educator.

Your task is to generate fill-in-the-blank questions.

RULES:
1. Generate EXACTLY 5 questions.
2. Each question must contain ONE blank represented as "____".
3. Provide the correct answer separately.
4. Keep sentences simple and clear.
5. Do NOT add extra fields.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- DATA MODELS ------------------ #
class FillBlank(BaseModel):
    question: str
    answer: str = Field(description="The correct answer for fill in the blank.")
    answer_embedding: Optional[List[float]] = Field(default=None, description="The embedding vector of the correct answer.")
    explanation: str = Field(description="A brief explanation of why the answer is correct.")

class FillBlankSet(BaseModel):
    questions: List[FillBlank]

    @field_validator("questions")
    @classmethod
    def validate_count(cls, v):
        if len(v) < 5:
            raise ValueError("Minimum 5 questions required")
        return v

# ------------------- MAIN CLASS ------------------ #
class MyFillBlankGenerator:
    conn = None
    llm = None
    fillblank_table = "tenanta.lessonsection_fillblanks"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate FillBlanks ----------- #
    @classmethod
    async def generate(cls, lesson_section_id: int, section_path: str, section_content: str = ""):
        parser = PydanticOutputParser(pydantic_object=FillBlankSet)

        prompt = PromptTemplate(
            template=FILLBLANKS_PROMPT_TEMPLATE,
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
                        response = FillBlankSet(**raw_json)
                        break
                    except Exception:
                        pass
                raise

        if response is None:
            raise RuntimeError("Failed to generate fill blanks")

        # for question in response.questions:
        #     embeddings = Utility.convert_text_to_embedding(question.answer)
        #     question.answer_embedding = embeddings.tolist()
            
        questions_data = [q.model_dump() for q in response.questions]
        fillblank_id = Utility.insert_data(cls.conn, cls.fillblank_table, section_path, json.dumps(questions_data))
        Utility.update_lessonsection(cls.conn, lesson_section_id, section_path, "fillblanksId", fillblank_id)

        return response

    