import psycopg2
import re
from typing import List, Optional

class SubjectLoader:
    conn = None
    llm = None
    table_name = "tenanta.subject"
    prefix = "ZY"

    @classmethod
    def initialize(cls, llm, conn):
        cls.llm = llm
        cls.conn = conn

    # ----------- Generate Next Lesson Code (Hierarchical) ----------- #
    @staticmethod
    def generate_next_subject_code(subject_path: str, last_path: Optional[str]) -> str:
        """
        Example:
        subject_path = T01
        last_path = T01.S03  → returns T01.S04
        """
        if not last_path:
            return f"{subject_path}.T01"

        match = re.search(rf"{re.escape(subject_path)}\.T(\d+)", last_path)
        last_number = int(match.group(1)) if match else 0

        return f"{subject_path}.T{str(last_number + 1).zfill(2)}"

    # ----------- Get Last Subject Path ----------- #
    @classmethod
    def get_last_path(cls) -> Optional[str]:
        query = f'SELECT path FROM {cls.table_name} ORDER BY "Id" DESC LIMIT 1'
        with cls.conn.cursor() as cur:
            cur.execute(query)
            row = cur.fetchone()
            return row[0] if row else None

    @classmethod
    def insert_subjects(
        cls, 
        subjects: List[str]):
        query = f"""
        INSERT INTO {cls.table_name} (path, name)
        VALUES (%s, %s)
        ON CONFLICT (name) DO NOTHING
        RETURNING "Id"
        """

        subject_details = []
        try:
            with cls.conn.cursor() as cur:
                last_path = cls.get_last_path()

                for subject in subjects:
                    if not subject:
                        continue

                    next_path = cls.generate_next_subject_code(cls.prefix, last_path)
                    cur.execute(query, (next_path, subject))
                    subject_id = cur.fetchone()[0]
                    subject_details.append((subject_id, next_path, subject))
                    print(f"Inserted: {subject} → {next_path}")
                    last_path = next_path  # update for next iteration

                cls.conn.commit()

        except Exception as e:
            cls.conn.rollback()
            print(f"Error: {e}")

        return subject_details
