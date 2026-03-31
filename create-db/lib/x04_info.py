from pydantic import BaseModel, Field
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import json

from lib.x00_utility import Utility

# ------------------- LESSON INFO PROMPT ------------------ #
LESSONINFO_PROMPT_TEMPLATE = """
You are a friendly school teacher with lots of knowledge and experience.

Your goal is to explain the provided paragraph to a 10-year-old child.

Instructions:
1. Summary: Provide 2-3 short sentences.
2. Explanation: Use simple words and analogies in short.
3. Examples: Provide 2 relatable real-life examples.

Paragraph:
{paragraph}

{format_instructions}
"""

# ------------------- DATA MODEL ------------------ #
class LessonInfo(BaseModel):
    # Use Optional and default to None so the Parser ignores it in the prompt instructions
    paragraph: Optional[str] = Field(default=None, exclude=True)
    explanation: str = Field(description="A simple, kid-friendly explanation using analogies.")
    summary: List [str] = Field(description="couple of high-level summary sentences.")
    examples: List [str] = Field(default_factory=list, description="2 simple, real-world examples.")

# ------------------- MAIN CLASS ------------------ #
class MyInfoGenerator:
    conn = None
    llm = None
    lessoninfo_table = "tenanta.lessonsection_lessoninfo"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Lesson Info using LLM ----------- #
    @classmethod
    async def generate(cls, lesson_section_id: int, section_path: str, section_content: str = "") -> LessonInfo:
        parser = PydanticOutputParser(pydantic_object=LessonInfo)

        prompt = PromptTemplate(
            template=LESSONINFO_PROMPT_TEMPLATE,
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
                raise

        if response is None:
            raise RuntimeError("Failed to generate lesson info.")

        info_data = {
            "paragraph": response.paragraph,
            "explanation": response.explanation,
            "summary": response.summary,
            "examples": response.examples
        }
        
        lessoninfo_id = Utility.insert_data(cls.conn, cls.lessoninfo_table, section_path, json.dumps(info_data))
        Utility.update_lessonsection(cls.conn, lesson_section_id, section_path, "lessoninfoId", lessoninfo_id)

        return response

    

    