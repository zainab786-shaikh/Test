import { Sequelize, Transaction } from "sequelize";

import { IStandardSubject } from "./0.model";
import { DTOStandardSubject} from "./7.dto.model";

export interface IRepoStandardSubject {
  isExist(inStandardSubjectId: number): Promise<boolean>;
  getAll(inStandardId: number): Promise<IStandardSubject[] | null>;
  getById(inStandardSubjectId: number): Promise<IStandardSubject | null>;
  create(
    inStandardSubject: IStandardSubject,
    transaction?: Transaction
  ): Promise<IStandardSubject | null>;
  update(
    inStandardSubjectId: number,
    inStandardSubject: IStandardSubject,
    transaction?: Transaction
  ): Promise<number>;
  delete(
    inStandardSubjectId: number,
    transaction?: Transaction
  ): Promise<number>;
  convertToObject(srcObject: DTOStandardSubject): IStandardSubject;
}
