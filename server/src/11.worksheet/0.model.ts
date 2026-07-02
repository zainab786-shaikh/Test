export interface IWorksheet {
  Id?: number;
  teacher_id: number;
  lesson_id: number;
  title: string;
  generated_at?: Date;
  student_count: number;
}

export interface IWorksheetQuestion {
  Id?: number;
  worksheet_id: number;
  student_number: number;
  lessonsection_id: number;
  question_type: string;
  question_index: number;
}
