import { Sequelize, Model, DataTypes } from "sequelize";
import { IFillInTheBlank, ILessonInfo, ILessonSection, IQuiz, IShortQuestion, ITrueFalse } from "./0.model";

export class DTOLessonSection extends Model {
  Id?: number;
  name!: string;
  lessoninfo!: ILessonInfo;
  quiz!: IQuiz[];
  fillblanks!: IFillInTheBlank[];
  truefalse!: ITrueFalse[];
  shortquestion!: IShortQuestion[];
  subject?: number;
  lesson?: number;
}

export const initDTOLessonSectionModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOLessonSection.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lessoninfo: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      quiz: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      fillblanks: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      truefalse: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      shortquestion: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      subject: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "subject",
          },
          key: "Id",
        },
      },
      lesson: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "lesson",
          },
          key: "Id",
        },
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection",
      timestamps: false,
    }
  );
};
