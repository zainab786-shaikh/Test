import { Sequelize, Model, DataTypes } from "sequelize";
import { IProgress } from "./0.model";

export class DTOProgress extends Model {
  Id?: number;
  QuizPercentage!: number;
  FillBlanksPercentage!: number;
  TrueFalsePercentage!: number;
  subject?: number;
  student?: number;
  standard?: number;
  school?: number;
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
      QuizPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      FillBlanksPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TrueFalsePercentage: {
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "progress",
      timestamps: false,
    }
  );
};
