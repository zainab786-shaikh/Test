import { Transaction } from "sequelize";
import { ILessonSection } from "./0.model";

export interface IRepoLessonSection {
  isExist(inLessonSectionId: number): Promise<boolean>;

  getAll(
    inSubjectId: number,
    inLessonId: number
  ): Promise<ILessonSection[] | null>;

  getById(inLessonSectionId: number): Promise<ILessonSection | null>;

  create(
    inLessonSection: ILessonSection,
    transaction?: Transaction
  ): Promise<ILessonSection | null>;

  update(
    lessonSectionId: number,
    inLessonSection: ILessonSection,
    transaction?: Transaction
  ): Promise<number>;

  delete(
    inLessonSectionId: number,
    transaction?: Transaction
  ): Promise<number>;
}