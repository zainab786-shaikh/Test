import { ITeacher } from "./0.model";

export interface IServiceTeacher {
  getAll(inSchoolId: number, inStandardId: number): Promise<ITeacher[] | null>;
  getByAdhaar(inAdhaar: string): Promise<ITeacher | null>;
  get(inTeacherId: number): Promise<ITeacher | null>;
  create(inTeacherInfo: ITeacher): Promise<ITeacher | null>;
  update(inTeacherId: number, inTeacherInfo: ITeacher): Promise<number>;
  delete(inTeacherId: number): Promise<number>;
}
