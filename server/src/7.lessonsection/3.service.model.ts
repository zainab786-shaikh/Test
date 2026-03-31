import { ILessonSection } from "./0.model";

export interface IServiceLessonSection {
  getAll(
    inSubjectId: number,
    inLessonId: number
  ): Promise<ILessonSection[] | null>;
  get(inLessonSectionId: number): Promise<ILessonSection | null>;
  getByPath(inLessonSectionPath: string): Promise<ILessonSection | null>;
  create(inLessonSectionInfo: Partial<ILessonSection>): Promise<ILessonSection | null>;
  update(inLessonSectionId: number, inLesson: ILessonSection): Promise<number>;
  updateByPath(inLessonSectionPath: string, inLesson: ILessonSection): Promise<number>;
  delete(inLessonSectionId: number): Promise<number>;
  deleteByPath(inLessonSectionPath: string): Promise<number>;
}
