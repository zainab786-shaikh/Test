import { IStandardSubject } from "./0.model";

export interface IServiceStandardSubject {
  getAll(inStandardId: number): Promise<IStandardSubject[] | null>;
  get(inStandardSubjectId: number): Promise<IStandardSubject | null>;
  create(
    inStandardSubjectInfo: IStandardSubject
  ): Promise<IStandardSubject | null>;
  update(
    inStandardSubjectId: number,
    inStandardSubjectInfo: IStandardSubject
  ): Promise<number>;
  delete(inStandardSubjectId: number): Promise<number>;
}
