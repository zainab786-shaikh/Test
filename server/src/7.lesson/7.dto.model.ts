import { Sequelize, Model, DataTypes } from "sequelize";
import { ILesson } from "./0.model";

export class DTOLesson extends Model {
  Id?: number;
  Name!: string;
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
      Quiz: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FillBlanks: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TrueFalse: {
        type: DataTypes.STRING,
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
