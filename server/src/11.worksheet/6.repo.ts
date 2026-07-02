import { Model, Transaction } from "sequelize";
import { injectable } from "inversify";
import { IWorksheet, IWorksheetQuestion } from "./0.model";
import { IRepoWorksheet, IRepoWorksheetQuestion } from "./5.repo.model";
import { DTOWorksheet, DTOWorksheetQuestion } from "./7.dto.model";
import { RequestContextProvider } from "../common/service/request-context.service";
import { container } from "../ioc/container";

@injectable()
export class RepoWorksheetImpl implements IRepoWorksheet {
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

  async create(
    inWorksheet: Partial<IWorksheet>,
    transaction?: Transaction
  ): Promise<IWorksheet | null> {
    const WorksheetModel = this.getModel(DTOWorksheet);
    const createdObj = await WorksheetModel.create(inWorksheet, {
      transaction,
    });
    return this.convertToObject(createdObj.dataValues);
  }

  async getAll(inTeacherId: number): Promise<IWorksheet[] | null> {
    const WorksheetModel = this.getModel(DTOWorksheet);
    const foundObj = await WorksheetModel.findAll<DTOWorksheet>({
      where: { teacher_id: inTeacherId },
      order: [["generated_at", "DESC"]],
    });
    return foundObj?.map((eachObj) => this.convertToObject(eachObj.dataValues));
  }

  async getById(inWorksheetId: number): Promise<IWorksheet | null> {
    const WorksheetModel = this.getModel(DTOWorksheet);
    const foundObj = await WorksheetModel.findOne<DTOWorksheet>({
      where: { Id: inWorksheetId },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj.dataValues);
    }
    return null;
  }

  private convertToObject(srcObject: DTOWorksheet): IWorksheet {
    return {
      Id: srcObject.Id,
      teacher_id: srcObject.teacher_id,
      lesson_id: srcObject.lesson_id,
      title: srcObject.title,
      generated_at: srcObject.generated_at,
      student_count: srcObject.student_count,
    };
  }
}

@injectable()
export class RepoWorksheetQuestionImpl implements IRepoWorksheetQuestion {
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

  async create(
    inWorksheetQuestion: Partial<IWorksheetQuestion>,
    transaction?: Transaction
  ): Promise<IWorksheetQuestion | null> {
    const WorksheetQuestionModel = this.getModel(DTOWorksheetQuestion);
    const createdObj = await WorksheetQuestionModel.create(inWorksheetQuestion, {
      transaction,
    });
    return this.convertToObject(createdObj.dataValues);
  }

  async getByWorksheetId(inWorksheetId: number): Promise<IWorksheetQuestion[] | null> {
    const WorksheetQuestionModel = this.getModel(DTOWorksheetQuestion);
    const foundObj = await WorksheetQuestionModel.findAll<DTOWorksheetQuestion>({
      where: { worksheet_id: inWorksheetId },
    });
    return foundObj?.map((eachObj) => this.convertToObject(eachObj.dataValues));
  }

  private convertToObject(srcObject: DTOWorksheetQuestion): IWorksheetQuestion {
    return {
      Id: srcObject.Id,
      worksheet_id: srcObject.worksheet_id,
      student_number: srcObject.student_number,
      lessonsection_id: srcObject.lessonsection_id,
      question_type: srcObject.question_type,
      question_index: srcObject.question_index,
    };
  }
}
