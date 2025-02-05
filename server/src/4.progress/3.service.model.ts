import { IProgress } from "./0.model";

export interface IServiceProgress {
  getAll(
    inSchoolId: number,
    inStandardId: number,
    inStudentId: number
  ): Promise<IProgress[] | null>;
  get(inProgressId: number): Promise<IProgress | null>;
  create(inProgressInfo: IProgress): Promise<IProgress | null>;
  update(inProgressId: number, inProgressInfo: IProgress): Promise<number>;
  delete(inProgressId: number): Promise<number>;
}
