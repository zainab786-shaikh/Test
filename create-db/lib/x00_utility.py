import os
from os import path
import json
import tempfile
import re
from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer, util


class Utility:
    embed_model = SentenceTransformer('all-MiniLM-L6-v2') 
                
    @classmethod
    def convert_text_to_embedding(cls, text):
        embedding = cls.embed_model.encode(text, convert_to_tensor=False)
        embedding = embedding.astype("float16")

        # Normalize vector
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm

        return embedding

    @classmethod
    def compare_text_to_embeddings(cls, embedding, text):
        text_embedding = cls.convert_text_to_embedding(text)

        # Convert to numpy if needed
        if not isinstance(embedding, np.ndarray):
            embedding = np.array(embedding, dtype=np.float16)

        # Dot product (since normalized)
        score = np.dot(embedding, text_embedding)

        print(f"Match Score: {score:.2f}")
        return score > 0.8
    
    @staticmethod
    def generate_next_code(prefix: str, last_path: Optional[str] = None) -> str:
        if not last_path:
            return f"{prefix}01"

        match = re.search(rf"{prefix}(\d+)", last_path)
        last_number = int(match.group(1)) if match else 0

        return f"{prefix}{str(last_number + 1).zfill(2)}"
    
    @staticmethod
    def extract_json(e: Exception):
        text = str(e)
        m = re.search(r"(\{.*\})", text, re.DOTALL)
        if not m:
            return None
        try:
            return json.loads(m.group(1))
        except:
            return None
        
    # ----------- Insert into lessonsection_lessoninfo ----------- #
    @classmethod
    def insert_data(
        cls, 
        conn,
        table_name: str,
        section_path: str, 
        json_data: str) -> int:

        query = f"""
        INSERT INTO {table_name} (path, data)
        VALUES (%s, %s::jsonb)
        ON CONFLICT (path) DO NOTHING
        RETURNING "Id"
        """
        try:
            with conn.cursor() as cur:
                cur.execute(query, (section_path, json_data))
                lessoninfo_id = cur.fetchone()[0]
                conn.commit()
                print(f"Inserted lessoninfo: {section_path} → {lessoninfo_id}")
                return lessoninfo_id
        except Exception as e:
            conn.rollback()
            print(f"Error inserting lessoninfo: {e}")
            raise
        
    @classmethod
    def insert_data_with_embedding(
        cls, 
        conn,
        table_name: str,
        section_path: str, 
        json_data: str,
        embedding  # 👈 NEW PARAM
    ) -> int:

        query = f"""
        INSERT INTO {table_name} (path, data, embedding)
        VALUES (%s, %s::jsonb, %s)
        ON CONFLICT (path) DO NOTHING
        RETURNING "Id"
        """

        try:
            with conn.cursor() as cur:
                # ✅ Convert embedding to list (important)
                if embedding is not None:
                    embedding = embedding.tolist()

                cur.execute(query, (section_path, json_data, embedding))

                result = cur.fetchone()
                lessoninfo_id = result[0] if result else None

                conn.commit()
                print(f"Inserted lessoninfo: {section_path} → {lessoninfo_id}")
                return lessoninfo_id

        except Exception as e:
            conn.rollback()
            print(f"Error inserting lessoninfo: {e}")
            raise
        
    # ----------- Update lessonsection ----------- #
    lessonsection_table = "tenanta.lessonsection"
    @classmethod
    def update_lessonsection(
        cls, 
        conn, 
        lesson_section_id: int, section_path: str, 
        col_name: str, col_data_id: int):

        update_query = f"""
            UPDATE {cls.lessonsection_table}
            SET "{col_name}" = %s
            WHERE "Id" = %s
            """
        try:
            with conn.cursor() as cur:
                cur.execute(
                    update_query,
                    (col_data_id, lesson_section_id)
                )
                conn.commit()
                print (f"Update Query => {col_name}: {col_data_id}, section_id: {lesson_section_id}")
        except Exception as e:
            conn.rollback()
            print(f"Error updating lessonsection: {e}")
        
