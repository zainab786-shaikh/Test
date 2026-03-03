

from email.mime import audio

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

#------------------- Lesson Content Prompt Template ------------------#
CONTENT_PROMPT_TEMPLATE = """
You are a friendly primary school teacher. 
Your goal is to explain the provided paragraph to a 10-year-old child.

Instructions:
1. **Summary**: Provide a quick 2-3 sentence overview.
2. **Explanation**: Use simple words and fun analogies. Imagine you are explaining it to a kid who has never heard of this before.
3. **Examples**: Provide couple of clear, relatable examples from everyday life.

Paragraph:
{paragraph}

{format_instructions}
"""

#------------------- Lesson Content Data Model ------------------#
class LessonContent(BaseModel):
    # Use Optional and default to None so the Parser ignores it in the prompt instructions
    paragraph: Optional[str] = Field(default=None, exclude=True)
    explanation: str = Field(description="A simple, kid-friendly explanation using analogies.")
    summary: List [str] = Field(description="couple of high-level summary sentences.")
    examples: List [str] = Field(default_factory=list, description="2 simple, real-world examples.")

class MyLessonContent():
    table_name = "lesson_contents"
    llm = None
    conn = None

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    @classmethod
    async def generate_contents(cls, path, input_content_text) -> LessonContent:
        parser = PydanticOutputParser(pydantic_object=LessonContent)
        prompt = PromptTemplate(
            template=CONTENT_PROMPT_TEMPLATE,
            input_variables=["paragraph"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        query_chain = prompt | cls.llm | parser
        response = query_chain.invoke({"paragraph": input_content_text})
        
        # 2. Assign the object
        response.paragraph = input_content_text
        if  response and \
            response.explanation and \
            response.summary:
            full_script = (
                f"Here is the explanation. {response.explanation}. "
                f"To wrap up, here is the summary. {"\n".join(response.summary)}"
            )
        
        cls.insert_data_db(
            conn=cls.conn, 
            path=path,
            data=response)
        
        return response
    
    @classmethod
    async def display_contents(cls, path) -> LessonContent:
        content_obj = cls.read_data_db(
            conn=cls.conn, 
            path=path)
        
        return content_obj

    @classmethod
    def insert_data_db(cls, conn, path: str, data: LessonContent):
        # 1. Added UNIQUE constraint to the 'path' column
        create_table_query = f"""
        CREATE TABLE IF NOT EXISTS {cls.table_name} (
            id SERIAL PRIMARY KEY,
            path TEXT UNIQUE, 
            paragraph TEXT,
            explanation TEXT,
            summary TEXT,
            examples TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        # 2. Use ON CONFLICT to perform the UPDATE if the path already exists
        upsert_query = f"""
        INSERT INTO {cls.table_name} (path, paragraph, explanation, summary, examples)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (path) 
        DO UPDATE SET 
            paragraph = EXCLUDED.paragraph,
            explanation = EXCLUDED.explanation,
            summary = EXCLUDED.summary,
            examples = EXCLUDED.examples
        """

        values = (
            path, 
            data.paragraph,
            data.explanation,
            "\n".join(data.summary) if isinstance(data.summary, list) else data.summary,
            "\n".join(data.examples) if isinstance(data.examples, list) else data.examples
        )

        try:
            with conn.cursor() as cur:
                cur.execute(create_table_query)
                cur.execute(upsert_query, values)
                conn.commit()
                print(f"Successfully processed (Upsert): {path}")
        except Exception as e:
            conn.rollback()
            print(f"Error processing {path}: {e}")
            
    @classmethod
    def read_data_db(cls, conn, path: str) -> Optional[LessonContent]:
        query = f"SELECT paragraph, explanation, summary, examples FROM {cls.table_name} WHERE path = '{path}'"

        try:
            with conn.cursor() as cur:
                cur.execute(query, (path,))
                row = cur.fetchone()

                if not row:
                    return None

                paragraph, explanation, summary_str, examples_str = row

                return LessonContent(
                                    paragraph=paragraph,
                                    explanation=explanation,
                                    summary=summary_str.split("\n") if summary_str else [],
                                    examples=examples_str.split("\n") if examples_str else []
                                )    
        except Exception as e:
            print(f"Error reading {path}: {e}")
            return None
