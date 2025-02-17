import { Sequelize, Model, DataTypes } from "sequelize";
import { ILesson } from "./0.model";

export class DTOLesson extends Model {
  Id?: number;
  Name!: string;
  Explanation!: string;
  Quiz!: string;
  FillBlanks!: string;
  TrueFalse!: string;
  subject?: number;
}

export const initDTOLessonModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOLesson.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Explanation: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      Quiz: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      FillBlanks: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      TrueFalse: {
        type: DataTypes.TEXT("long"),
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
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lesson",
      timestamps: false,
    }
  );
};
