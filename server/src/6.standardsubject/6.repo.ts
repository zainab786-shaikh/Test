import { Model, Sequelize, Transaction } from "sequelize";
import { injectable } from "inversify";
import { IStandardSubject } from "./0.model";
import { IRepoStandardSubject } from "./5.repo.model";
import { DTOStandardSubject } from "./7.dto.model";
import { RequestContextProvider } from "../common/service/request-context.service";
import { container } from "../ioc/container";

@injectable()
export class RepoStandardSubjectImpl implements IRepoStandardSubject {
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

  async isExist(inStandardSubjectId: number): Promise<boolean> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);
    const found = await StandardSubjectModel.findOne({
      where: { Id: inStandardSubjectId },
    });
    return found !== null;
  }

  async getAll(inStandardId: number): Promise<IStandardSubject[] | null> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);
    const foundObj = await StandardSubjectModel.findAll<DTOStandardSubject>({
      where: { standard: inStandardId },
    });
    return foundObj?.map((eachObj) => this.convertToObject(eachObj.dataValues));
  }

  async getById(inStandardSubjectId: number): Promise<IStandardSubject | null> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);
    const foundObj = await StandardSubjectModel.findOne<DTOStandardSubject>({
      where: { Id: inStandardSubjectId },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj?.dataValues);
    }
    return null;
  }

  async create(
    inStandardSubject: Partial<IStandardSubject>,
    transaction?: Transaction
  ): Promise<IStandardSubject | null> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);
    const createdObj = await StandardSubjectModel.create(inStandardSubject, {
      transaction,
    });
    createdObj.dataValues.Id = createdObj.Id;
    return this.convertToObject(createdObj.dataValues);
  }

  async update(
    inStandardSubjectId: number,
    inStandardSubject: IStandardSubject,
    transaction?: Transaction
  ): Promise<number> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);

    const [count] = await StandardSubjectModel.update(inStandardSubject, {
      where: { Id: inStandardSubjectId },
      transaction,
    });

    return count;
  }

  async delete(
    inStandardSubjectId: number,
    transaction?: Transaction
  ): Promise<number> {
    const StandardSubjectModel = this.getModel(DTOStandardSubject);
    const count = await StandardSubjectModel.destroy({
      where: { Id: inStandardSubjectId },
      transaction,
    });
    return count;
  }

  convertToObject(srcObject: DTOStandardSubject): IStandardSubject {
    return {
      Id: srcObject.Id,
      standard: srcObject.standard,
      subject: srcObject.subject,
    };
  }
}
