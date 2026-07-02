import { IWorksheet } from "./0.model";

export interface IServiceWorksheet {
  getAvailableQuestionsCount(
    lessonId: number
  ): Promise<{
    MCQ: number;
    TRUE_FALSE: number;
    FILL_BLANK: number;
    SHORT_ANSWER: number;
  }>;
  createWorksheet(
    teacherId: number,
    config: {
      title: string;
      lessonId: number;
      studentCount: number;
      totalMarks?: number;
      quantities: {
        MCQ: number;
        TRUE_FALSE: number;
        FILL_BLANK: number;
        SHORT_ANSWER: number;
      };
      allowReuse: boolean;
    }
  ): Promise<{ warning: any } | { worksheet: IWorksheet; zipPath: string }>;
  getById(id: number): Promise<IWorksheet | null>;
}
