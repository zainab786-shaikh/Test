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
LESSON_PROMPT_TEMPLATE = """
You are an expert curriculum designer.

Your task is to create a structured list of lessons for the given subject.

Instructions:
1. Generate 1-2 lesson titles.
2. Keep titles short and meaningful.
3. Ensure logical progression from basic to advanced.
4. Do NOT include numbering in lesson names.

Subject:
{subject}

{format_instructions}
"""

# ------------------- DATA MODEL ------------------ #
class LessonList(BaseModel):
    subject: Optional[str] = Field(default=None, exclude=True)
    lessons: List[str] = Field(description="List of lesson titles")

# ------------------- MAIN CLASS ------------------ #
class MyLessonGenerator:
    conn = None
    llm = None
    table_name = "tenanta.lesson"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Next Lesson Code (Hierarchical) ----------- #
    @staticmethod
    def generate_next_lesson_code(subject_path: str, last_path: Optional[str]) -> str:
        """
        Example:
        subject_path = T01
        last_path = T01.S03  → returns T01.S04
        """
        if not last_path:
            return f"{subject_path}.L01"

        match = re.search(rf"{re.escape(subject_path)}\.L(\d+)", last_path)
        last_number = int(match.group(1)) if match else 0

        return f"{subject_path}.L{str(last_number + 1).zfill(2)}"

    # ----------- Get Last Lesson Path for Subject ----------- #
    @classmethod
    def get_last_path(cls, subject_id: int) -> Optional[str]:
        query = f'SELECT path FROM {cls.table_name} WHERE subject = %s ORDER BY "Id" DESC LIMIT 1'
        with cls.conn.cursor() as cur:
            cur.execute(query, (subject_id,))
            row = cur.fetchone()
            return row[0] if row else None

     # ----------- Generate Lesson Info using LLM ----------- #
    
    @classmethod
    async def generate(cls, subject_id: int, subject_path: str, subject_name: str = "") -> LessonList:
        parser = PydanticOutputParser(pydantic_object=LessonList)

        prompt = PromptTemplate(
            template=LESSON_PROMPT_TEMPLATE,
            input_variables=["subject"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | cls.llm | parser

        max_attempts = 3
        response = None

        for attempt in range(1, max_attempts + 1):
            try:
                response = chain.invoke({"subject": subject_name})
                break
            except OutputParserException:
                if attempt < max_attempts:
                    continue
                raise

        if response is None:
            raise RuntimeError("Failed to generate lesson info.")

        lesson_details = cls.insert_lessons(subject_id, subject_path, response.lessons)

        return lesson_details

    # ----------- Insert Lessons ----------- #
    @classmethod
    def insert_lessons(
        cls,
        subject_id: int,
        subject_path: str,
        lessons: List[str]
    ):
        query = f"""
        INSERT INTO {cls.table_name} (path, name, subject)
        VALUES (%s, %s, %s)
        ON CONFLICT (name) DO NOTHING
        RETURNING "Id"
        """

        lesson_details = []
        try:
            with cls.conn.cursor() as cur:
                last_path = cls.get_last_path(subject_id)

                for lesson in lessons:
                    if not lesson:
                        continue

                    next_path = cls.generate_next_lesson_code(subject_path, last_path)

                    cur.execute(query, (next_path, lesson, subject_id))
                    lesson_id = cur.fetchone()[0]
                    lesson_details.append((lesson_id, next_path, lesson))
                    print(f"Inserted Lesson: {lesson} → {next_path}")
                    last_path = next_path  # update for next iteration

                cls.conn.commit()

        except Exception as e:
            cls.conn.rollback()
            print(f"Error inserting lessons: {e}")
            
        return lesson_details
