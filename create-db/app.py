import atexit
import json
import asyncio
import sys
import sys
from langchain_ollama import OllamaLLM
import numpy as np

from lib.x00_data_ingestor import DataIngestor
from lib.x01_subject import SubjectLoader
from lib.x02_lesson import MyLessonGenerator
from lib.x03_lessoncontent import MySectionContentGenerator
from lib.x03_section import MySectionGenerator
from lib.x04_info import MyInfoGenerator
from lib.x05_quiz import MyLessonQuizGenerator
from lib.x06_fillblank import MyFillBlankGenerator
from lib.x07_truefalse import MyLessonTrueFalseGenerator
from lib.x08_shortquestion import MyLessonShortQuestionGenerator

# Global variable to hold the ingestor for cleanup
_ingestor = None

def cleanup():
    """Closes the database connection on exit."""
    global _ingestor
    if _ingestor:
        print("\nClosing database connection...")
        _ingestor.close()
        print("Cleanup complete.")

def signal_handler(sig, frame):
    """Handles manual termination (Ctrl+C)."""
    sys.exit(0)

# Register exit handlers
atexit.register(cleanup)


def initialize_app():
    """Initializes global dependencies and lesson classes."""
    db_params = {
        "dbname": "tenantb",
        "user": "root",
        "password": "Allahu",
        "host": "127.0.0.1"
    }
    
    # Setup Data and LLM
    global _ingestor
    _ingestor = DataIngestor(db_params)
    conn = _ingestor.get_connection()
    model_name = "ministral-3:3b"
    llm = OllamaLLM(model=model_name, format="json", temperature=0)
    return llm, conn 

async def get_and_store_information(llm, conn):
    """Main function to orchestrate data retrieval and storage."""
    # Example usage of the initialized classes
    # You can replace this with actual logic to generate lessons, quizzes, etc.
    subjects = [
        "Operating Systems" #,
        # "Computer Architecture and Organization",
        # "Computer Networks"
    ]
    subject_loader = SubjectLoader()
    subject_loader.initialize(llm, conn)
    subject_detail = subject_loader.insert_subjects(subjects)
    
    for each_subject_detail in subject_detail:
        subject_id, subject_path, subject_name = each_subject_detail
        print(f"Subject ID: {subject_id}, Subject Path: {subject_path}, Subject Name: {subject_name}")
        
        lesson_generator = MyLessonGenerator()
        lesson_generator.initialize(llm, conn)
        lesson_info = await lesson_generator.generate(subject_id, subject_path, subject_name)
        
        for each_lesson in lesson_info:
            lesson_id, lesson_path, lesson_name = each_lesson
            print(f"Lesson ID: {lesson_id}, Lesson Path: {lesson_path}, Lesson Name: {lesson_name}")
            
            lesson_section_generator =  MySectionGenerator()
            lesson_section_generator.initialize(llm, conn)
            lesson_section_details = await lesson_section_generator.generate(subject_id, subject_name, lesson_id, lesson_path, lesson_name)
            
            for each_section in lesson_section_details:
                lessonsection_id, section_path, section = each_section
                print(f"LessonSection ID: {lessonsection_id}, Section Path: {section_path}, Section Name: {section}")
                
                section_content_generator =  MySectionContentGenerator()
                section_content_generator.initialize(llm, conn)
                section_content = await section_content_generator.generate(subject_name, lesson_name, section)
                
                        
                lesson_info_generator = MyInfoGenerator()
                lesson_info_generator.initialize(llm, conn)
                await lesson_info_generator.generate(lessonsection_id, section_path, section_content)

                lesson_qz_generator = MyLessonQuizGenerator()
                lesson_qz_generator.initialize(llm, conn)
                await lesson_qz_generator.generate(lessonsection_id, section_path, section_content)
                
                lesson_fb_generator = MyFillBlankGenerator()
                lesson_fb_generator.initialize(llm, conn)
                await lesson_fb_generator.generate(lessonsection_id, section_path, section_content)
                
                lesson_tf_generator = MyLessonTrueFalseGenerator()
                lesson_tf_generator.initialize(llm, conn)
                await lesson_tf_generator.generate(lessonsection_id, section_path, section_content)
                
                lesson_sq_generator = MyLessonShortQuestionGenerator()
                lesson_sq_generator.initialize(llm, conn)
                await lesson_sq_generator.generate(lessonsection_id, section_path, section_content)
                
                exit(0)  # Exit after processing the first subject for demonstration
            
       
if __name__ == "__main__":
    llm, conn = initialize_app()
    asyncio.run(get_and_store_information(llm, conn))
    
