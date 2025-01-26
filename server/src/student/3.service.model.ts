
  import { IStudent } from "./0.model";

  export interface IServiceStudent {
    getAll(inStandardId: number): Promise<IStudent[] | null>;
    get(inStudentId: number): Promise<IStudent | null>;
    create(inStudentInfo: IStudent): Promise<IStudent | null>;
    update(inStudentId: number, inStudentInfo: IStudent): Promise<number>;
    delete(inStudentId: number): Promise<number>;
  }
  