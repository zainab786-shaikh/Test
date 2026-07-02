import { Transaction } from "sequelize";
import { IWorksheet, IWorksheetQuestion } from "./0.model";

export interface IRepoWorksheet {
  create(
    inWorksheet: Partial<IWorksheet>,
    transaction?: Transaction
  ): Promise<IWorksheet | null>;
  getAll(inTeacherId: number): Promise<IWorksheet[] | null>;
  getById(inWorksheetId: number): Promise<IWorksheet | null>;
}

export interface IRepoWorksheetQuestion {
  create(
    inWorksheetQuestion: Partial<IWorksheetQuestion>,
    transaction?: Transaction
  ): Promise<IWorksheetQuestion | null>;
  getByWorksheetId(inWorksheetId: number): Promise<IWorksheetQuestion[] | null>;
}
