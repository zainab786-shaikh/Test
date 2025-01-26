
    import { Sequelize, Transaction } from "sequelize";

    import { IContent } from "./0.model";
    import { DTOContent } from "./7.dto.model";

    export interface IRepoContent {
      isExist(inContentId: number): Promise<boolean>;
      getAll(inSubjectId: number): Promise<IContent [] | null>;
      getById(inContentId: number): Promise<IContent | null>;
      create(
        inContent: IContent,
        transaction?: Transaction
      ): Promise<IContent | null>;
      update(
        contentId: number,
        inContent: IContent,
        transaction?: Transaction
      ): Promise<number>;
      delete(inContentId: number, transaction?: Transaction): Promise<number>;
      convertToObject(srcObject: DTOContent): IContent;
    }
    