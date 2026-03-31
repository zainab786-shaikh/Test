import { ILesson } from "./0.model";

export interface IServiceLesson {
  getAll(inSubjectId: number): Promise<ILesson[] | null>;
  get(inLessonId: number): Promise<ILesson | null>;
  getByPath(inPath: string): Promise<ILesson | null>;
  create(inLessonInfo: Partial<ILesson>): Promise<ILesson | null>;
  update(inLessonId: number, inLessonInfo: ILesson): Promise<number>;
  updateByPath(inPath: string, inLessonInfo: ILesson): Promise<number>;
  delete(inLessonId: number): Promise<number>;
  deleteByPath(inPath: string): Promise<number>;
}
