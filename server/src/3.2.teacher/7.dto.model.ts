import { Sequelize, Model, DataTypes } from "sequelize";
import { ITeacher } from "./0.model";

export class DTOTeacher extends Model {
  Id?: number;
  name!: string;
  adhaar!: string;
  school?: number;
  standard?: number;
}

export const initDTOTeacherModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOTeacher.init(
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
      adhaar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "school",
          },
          key: "Id",
        },
      },
      standard: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "standard",
          },
          key: "Id",
        },
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "teacher",
      timestamps: false,
    }
  );
};
