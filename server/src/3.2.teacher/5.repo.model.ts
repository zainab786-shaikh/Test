import { Sequelize, Transaction } from "sequelize";

import { ITeacher } from "./0.model";
import { DTOTeacher } from "./7.dto.model";

export interface IRepoTeacher {
  isExist(inTeacherId: number): Promise<boolean>;
  getAll(inSchoolId: number, inStandardId: number): Promise<ITeacher[] | null>;
  getById(inTeacherId: number): Promise<ITeacher | null>;
  getByAdhaar(inAdhaar: string): Promise<ITeacher | null>;
  create(
    inTeacher: ITeacher,
    transaction?: Transaction
  ): Promise<ITeacher | null>;
  update(
    teacherId: number,
    inTeacher: ITeacher,
    transaction?: Transaction
  ): Promise<number>;
  delete(inTeacherId: number, transaction?: Transaction): Promise<number>;
  convertToObject(srcObject: DTOTeacher): ITeacher;
}
