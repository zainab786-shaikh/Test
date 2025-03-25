import { Model, Sequelize, Transaction } from "sequelize";
import { injectable } from "inversify";
import { ITeacher } from "./0.model";
import { IRepoTeacher } from "./5.repo.model";
import { DTOTeacher } from "./7.dto.model";
import { RequestContextProvider } from "../common/service/request-context.service";
import { container } from "../ioc/container";

@injectable()
export class RepoTeacherImpl implements IRepoTeacher {
  private getModel<T extends typeof Model>(model: T): T {
    const contextProvider = container.get(RequestContextProvider);
    const context = contextProvider.get();

    if (!context || !context.databaseConnection) {
      throw new Error("Sequelize instance not found in context");
    }

    const modelInstance = context.databaseConnection.model(model.name) as T;
    if (!modelInstance) {
      throw new Error(`Model ${model.name} not initialized`);
    }

    return modelInstance;
  }

  async isExist(inTeacherId: number): Promise<boolean> {
    const TeacherModel = this.getModel(DTOTeacher);
    const found = await TeacherModel.findOne({
      where: { Id: inTeacherId },
    });
    return found !== null;
  }

  async getAll(
    inSchoolId: number,
    inStandardId: number
  ): Promise<ITeacher[] | null> {
    const TeacherModel = this.getModel(DTOTeacher);
    const foundObj = await TeacherModel.findAll<DTOTeacher>({
      where: { school: inSchoolId, standard: inStandardId },
    });
    return foundObj?.map((eachObj) => this.convertToObject(eachObj.dataValues));
  }

  async getById(inTeacherId: number): Promise<ITeacher | null> {
    const TeacherModel = this.getModel(DTOTeacher);
    const foundObj = await TeacherModel.findOne<DTOTeacher>({
      where: { Id: inTeacherId },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj?.dataValues);
    }
    return null;
  }

  async getByAdhaar(inAdhaar: string): Promise<ITeacher | null> {
    const TeacherModel = this.getModel(DTOTeacher);
    const foundObj = await TeacherModel.findOne<DTOTeacher>({
      where: { adhaar: inAdhaar },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj?.dataValues);
    }
    return null;
  }

  async create(
    inTeacher: Partial<ITeacher>,
    transaction?: Transaction
  ): Promise<ITeacher | null> {
    const TeacherModel = this.getModel(DTOTeacher);
    const createdObj = await TeacherModel.create(inTeacher, {
      transaction,
    });
    createdObj.dataValues.Id = createdObj.Id;
    return this.convertToObject(createdObj.dataValues);
  }

  async update(
    teacherId: number,
    inTeacher: ITeacher,
    transaction?: Transaction
  ): Promise<number> {
    const TeacherModel = this.getModel(DTOTeacher);

    const [count] = await TeacherModel.update(inTeacher, {
      where: { Id: teacherId },
      transaction,
    });

    return count;
  }

  async delete(
    inTeacherId: number,
    transaction?: Transaction
  ): Promise<number> {
    const TeacherModel = this.getModel(DTOTeacher);
    const count = await TeacherModel.destroy({
      where: { Id: inTeacherId },
      transaction,
    });
    return count;
  }

  convertToObject(srcObject: DTOTeacher): ITeacher {
    return {
      Id: srcObject.Id,
      name: srcObject.name,
      adhaar: srcObject.adhaar,
      school: srcObject.school,
      standard: srcObject.standard,
    };
  }
}
