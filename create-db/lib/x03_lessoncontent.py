from importlib.resources import path

from pydantic import BaseModel, Field
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import re
import json

# ------------------- SECTION CONTENT PROMPT ------------------ #
SECTION_CONTENT_PROMPT_TEMPLATE = """
You are an expert in the given subject.
Your task is to create content of the section of the given lesson of a given subject in a paragraph.

Instructions:
1. Generate content for the given section of a lesson in one paragraph.
2. Generate meaningful and non duplicate contents.
3. Ensure content contain logical progression from basic to advanced.
4. STRICTLY return output in JSON format only.
5. Do not add any extra text outside JSON.

Subject:
{subject}

Lesson Title:
{lesson}

Section Title:
{section}

{format_instructions}
"""

# ------------------- DATA MODEL ------------------ #
class SectionContent(BaseModel):
    content: str = Field(description="Content of the section")

# ------------------- MAIN CLASS ------------------ #
class MySectionContentGenerator:
    llm = None
    conn = None

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Section Content using LLM ----------- #

    @classmethod
    async def generate(cls, subject: str, lesson_name: str, section_name: str) -> SectionContent:
        parser = PydanticOutputParser(pydantic_object=SectionContent)

        prompt = PromptTemplate(
            template=SECTION_CONTENT_PROMPT_TEMPLATE,
            input_variables=["subject", "lesson", "section"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | cls.llm | parser

        max_attempts = 3
        response = None

        for attempt in range(1, max_attempts + 1):
            try:
                response = await chain.ainvoke(
                    {"subject": subject, "lesson": lesson_name, "section": section_name}
                )
                break
            except Exception as e:
                print("ERROR:", e)
                if attempt < max_attempts:
                    continue
                raise RuntimeError(f"Failed after retries: {str(e)}")
        if response is None:
            raise RuntimeError("Failed to generate section content.")
        
        return response.content
