import { IStandard } from "./0.model";

export interface IServiceStandard {
  getAll(inSchoolId: number): Promise<IStandard[] | null>;
  get(inStandardId: number): Promise<IStandard | null>;
  create(inStandardInfo: IStandard): Promise<IStandard | null>;
  update(inStandardId: number, inStandardInfo: IStandard): Promise<number>;
  delete(inStandardId: number): Promise<number>;
}
