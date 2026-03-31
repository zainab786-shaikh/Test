from importlib.resources import path

from pydantic import BaseModel, Field
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from langchain.prompts import PromptTemplate
import psycopg2
import re
import json

# ------------------- LESSON LIST PROMPT ------------------ #
SECTION_PROMPT_TEMPLATE = """
You are an expert curriculum designer.

Your task is to create a structured list of sections for the given lesson and subject.

Instructions:
1. Generate 1-2 section titles.
2. Keep titles short and meaningful.
3. Ensure logical progression from basic to advanced.
4. Do NOT include numbering in section names.

Subject:
{subject}

Lesson:
{lesson}

{format_instructions}
"""

# ------------------- DATA MODEL ------------------ #
class SectionList(BaseModel):
    lesson: Optional[str] = Field(default=None, exclude=True)
    sections: List[str] = Field(description="List of section titles")

# ------------------- MAIN CLASS ------------------ #
class MySectionGenerator:
    conn = None
    llm = None
    table_name = "tenanta.lessonsection"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Next Section Code (Hierarchical) ----------- #
    @staticmethod
    def generate_next_section_code(lesson_path: str, last_path: Optional[str]) -> str:
        """
        Example:
        lesson_path = T01
        last_path = T01.S03  → returns T01.S04
        """
        if not last_path:
            return f"{lesson_path}.S01"

        match = re.search(rf"{re.escape(lesson_path)}\.S(\d+)", last_path)
        last_number = int(match.group(1)) if match else 0

        return f"{lesson_path}.S{str(last_number + 1).zfill(2)}"

    # ----------- Get Last Section Path for Subject ----------- #
    @classmethod
    def get_last_path(cls, lesson_id: int) -> Optional[str]:
        query = f'SELECT path FROM {cls.table_name} WHERE lesson = %s ORDER BY "Id" DESC LIMIT 1'
        with cls.conn.cursor() as cur:
            cur.execute(query, (lesson_id,))
            row = cur.fetchone()
            return row[0] if row else None

     # ----------- Generate Section Info using LLM ----------- #
    
    @classmethod
    async def generate(cls, subject_id: int, subject_name: str, lesson_id: int, lesson_path: str, lesson_name: str ) -> SectionList:
        parser = PydanticOutputParser(pydantic_object=SectionList)

        prompt = PromptTemplate(
            template=SECTION_PROMPT_TEMPLATE,
            input_variables=["subject", "lesson"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | cls.llm | parser

        max_attempts = 3
        response = None

        for attempt in range(1, max_attempts + 1):
            try:
                response = await chain.ainvoke({"subject": subject_name, "lesson": lesson_name})
                break
            except OutputParserException:
                if attempt < max_attempts:
                    continue
                raise

        if response is None:
            raise RuntimeError("Failed to generate section info.")

        lesson_section_details = cls.insert_lessonsection(subject_id, lesson_id, lesson_path, response.sections)

        return lesson_section_details

    # ----------- Insert Lessons ----------- #
    @classmethod
    def insert_lessonsection(
        cls,
        subject_id: int,
        lessonsection_id: int,
        lesson_path: str,
        sections: List[str]
    ):
        query = f"""
        INSERT INTO {cls.table_name} 
        (path, name, subject, lesson, "lessoninfoId", "quizId", "fillblanksId", "truefalseId", "shortquestionId")
        VALUES (%s, %s, %s, %s, NULL, NULL, NULL, NULL, NULL)
        ON CONFLICT (name) DO NOTHING
        RETURNING "Id"
        """

        lesson_section_details = []
        try:
            with cls.conn.cursor() as cur:
                last_path = cls.get_last_path(lessonsection_id)

                for section in sections:
                    if not section:
                        continue

                    next_path = cls.generate_next_section_code(lesson_path, last_path)

                    cur.execute(query, (next_path, section, subject_id, lessonsection_id))
                    lessonsection_id = cur.fetchone()[0]
                    lesson_section_details.append((lessonsection_id, next_path, section))
                    print(f"Inserted Section: {section} → {next_path}")
                    last_path = next_path  # update for next iteration

                cls.conn.commit()

        except Exception as e:
            cls.conn.rollback()
            print(f"Error inserting lessons: {e}")
            
        return lesson_section_details
