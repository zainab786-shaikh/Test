import { Model, Sequelize, Transaction } from "sequelize";
import { injectable } from "inversify";
import { ILesson } from "./0.model";
import { IRepoLesson } from "./5.repo.model";
import { DTOLesson } from "./7.dto.model";
import { RequestContextProvider } from "../common/service/request-context.service";
import { container } from "../ioc/container";
import { generateNextCode } from "../common/utility/common-utils";

@injectable()
export class RepoLessonImpl implements IRepoLesson {
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

  async isExist(inLessonId: number): Promise<boolean> {
    const LessonModel = this.getModel(DTOLesson);
    const found = await LessonModel.findOne({
      where: { Id: inLessonId },
    });
    return found !== null;
  }

  async getAll(inSubjectId: number): Promise<ILesson[] | null> {
    const LessonModel = this.getModel(DTOLesson);
    const foundObj = await LessonModel.findAll<DTOLesson>({
      where: { subject: inSubjectId },
    });
    return foundObj?.map((eachObj) => this.convertToObject(eachObj.dataValues));
  }

  async getById(inLessonId: number): Promise<ILesson | null> {
    const LessonModel = this.getModel(DTOLesson);
    const foundObj = await LessonModel.findOne<DTOLesson>({
      where: { Id: inLessonId },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj?.dataValues);
    }
    return null;
  }

  async getByPath(inPath: string): Promise<ILesson | null> {
    const LessonModel = this.getModel(DTOLesson);
    const foundObj = await LessonModel.findOne<DTOLesson>({
      where: { path: inPath },
    });
    if (foundObj?.dataValues) {
      return this.convertToObject(foundObj?.dataValues);
    }
    return null;
  }

  async create(
    inLesson: Partial<ILesson>,
    transaction?: Transaction
  ): Promise<ILesson | null> {
    const LessonModel = this.getModel(DTOLesson);

    if (!inLesson.subject) {
      throw new Error("subject is required");
    }

    // 1. Get subject path (e.g., T01)
    const SubjectModel = this.getModel<any>("DTOSubject" as any);
    const subject = await SubjectModel.findOne({
      where: { Id: inLesson.subject },
      transaction,
    });

    if (!subject?.path) {
      throw new Error("Invalid subject");
    }

    const subjectPath = subject.path;

    // 2. Get last lesson under this subject
    const lastLesson = await LessonModel.findOne({
      where: {
        path: {
          [require("sequelize").Op.like]: `${subjectPath}.L%`,
        },
      },
      order: [["path", "DESC"]],
      transaction,
    });

    // 3. Generate lesson code
    const nextLessonCode = generateNextCode(
      "L",
      lastLesson?.path?.split(".").pop()
    );

    // 4. Build full path
    inLesson.path = `${subjectPath}.${nextLessonCode}`;

    // 5. Create
    const createdObj = await LessonModel.create(inLesson, {
      transaction,
    });

    createdObj.dataValues.Id = createdObj.Id;

    return this.convertToObject(createdObj.dataValues);
  }

  async update(
    lessonId: number,
    inLesson: ILesson,
    transaction?: Transaction
  ): Promise<number> {
    const LessonModel = this.getModel(DTOLesson);

    const [count] = await LessonModel.update(inLesson, {
      where: { Id: lessonId },
      transaction,
    });

    return count;
  }

  async updateByPath(
    inPath: string,
    inLesson: ILesson,
    transaction?: Transaction
  ): Promise<number> {
    const LessonModel = this.getModel(DTOLesson);

    const [count] = await LessonModel.update(inLesson, {
      where: { path: inPath },
      transaction,
    });

    return count;
  }

  async delete(inLessonId: number, transaction?: Transaction): Promise<number> {
    const LessonModel = this.getModel(DTOLesson);
    const count = await LessonModel.destroy({
      where: { Id: inLessonId },
      transaction,
    });
    return count;
  }

  async deleteByPath(inPath: string, transaction?: Transaction): Promise<number> {
    const LessonModel = this.getModel(DTOLesson);
    const count = await LessonModel.destroy({
      where: { path: inPath },
      transaction,
    });
    return count;
  }

  convertToObject(srcObject: DTOLesson): ILesson {
    return {
      Id: srcObject.Id,
      name: srcObject.name,
      subject: srcObject.subject,
      path: srcObject.path,
    };
  }
}
