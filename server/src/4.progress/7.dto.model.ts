import { Sequelize, Model, DataTypes } from "sequelize";
import { IProgress } from "./0.model";

export class DTOProgress extends Model {
  Id?: number;
  Quiz!: number;
  FillBlanks!: number;
  TrueFalse!: number;
  school?: number;
  standard?: number;
  student?: number;
  subject?: number;
  lesson?: number;
}

export const initDTOProgressModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOProgress.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      Quiz: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      FillBlanks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TrueFalse: {
        type: DataTypes.INTEGER,
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
      student: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "student",
          },
          key: "Id",
        },
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
      tableName: "progress",
      timestamps: false,
    }
  );
};
