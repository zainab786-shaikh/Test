import { Sequelize, Transaction } from "sequelize";

import { IProgress } from "./0.model";
import { DTOProgress } from "./7.dto.model";

export interface IRepoProgress {
  isExist(inProgressId: number): Promise<boolean>;
  getAll(
    inSubjectId: number,
    inStudentId: number,
    inStandardId: number,
    inSchoolId: number
  ): Promise<IProgress[] | null>;
  getById(inProgressId: number): Promise<IProgress | null>;
  create(
    inProgress: IProgress,
    transaction?: Transaction
  ): Promise<IProgress | null>;
  update(
    progressId: number,
    inProgress: IProgress,
    transaction?: Transaction
  ): Promise<number>;
  delete(inProgressId: number, transaction?: Transaction): Promise<number>;
  convertToObject(srcObject: DTOProgress): IProgress;
}
