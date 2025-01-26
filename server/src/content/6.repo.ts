
  import { Model, Sequelize, Transaction } from "sequelize";
  import { injectable } from "inversify";
  import { IContent } from "./0.model";
  import { IRepoContent } from "./5.repo.model";
  import { DTOContent } from "./7.dto.model";
  import { RequestContextProvider } from "../common/service/request-context.service";
  import { container } from "../ioc/container";

  @injectable()
  export class RepoContentImpl implements IRepoContent {
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

    async isExist(inContentId: number): Promise<boolean> {
      const ContentModel = this.getModel(DTOContent);
      const found = await ContentModel.findOne({
        where: { Id: inContentId },
      });
      return found !== null;
    }

    async getAll(inSubjectId: number): Promise<IContent[] | null> {
      const ContentModel = this.getModel(DTOContent);
      const foundObj = await ContentModel.findAll<DTOContent>({ where: { subject: inSubjectId } });
      return foundObj?.map((eachObj) =>
        this.convertToObject(eachObj.dataValues)
      );
    }

    async getById(inContentId: number): Promise<IContent | null> {
      const ContentModel = this.getModel(DTOContent);
      const foundObj = await ContentModel.findOne<DTOContent>({
        where: { Id: inContentId },
      });
      if (foundObj?.dataValues) {
        return this.convertToObject(foundObj?.dataValues);
      }
      return null;
    }

    async create(
      inContent: Partial<IContent>,
      transaction?: Transaction
    ): Promise<IContent | null> {
      const ContentModel = this.getModel(DTOContent);
      const createdObj = await ContentModel.create(inContent, {
        transaction,
      });
      createdObj.dataValues.Id = createdObj.Id;
      return this.convertToObject(createdObj.dataValues);
    }

    async update(
      contentId: number,
      inContent: IContent,
      transaction?: Transaction
    ): Promise<number> {
      const ContentModel = this.getModel(DTOContent);

      const [count] = await ContentModel.update(inContent, {
        where: { Id: contentId },
        transaction,
      });

      return count;
    }

    async delete(
      inContentId: number,
      transaction?: Transaction
    ): Promise<number> {
      const ContentModel = this.getModel(DTOContent);
      const count = await ContentModel.destroy({
        where: { Id: inContentId },
        transaction,
      });
      return count;
    }

    convertToObject(srcObject: DTOContent): IContent {
      return {
        Id: srcObject.Id,
      Quiz: srcObject.Quiz,
      FillBlanks: srcObject.FillBlanks,
      TrueFalse: srcObject.TrueFalse,
      subject: srcObject.subject,
      };
    }
  }
  