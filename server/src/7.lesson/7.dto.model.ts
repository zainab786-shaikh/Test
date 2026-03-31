import { Sequelize, Model, DataTypes } from "sequelize";
import { ILesson } from "./0.model";

export class DTOLesson extends Model {
  Id?: number;
  path?: string;
  name!: string;
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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
