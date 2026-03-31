import { Sequelize, Model, DataTypes } from "sequelize";
import { IStandardSubject } from "./0.model";

export class DTOStandardSubject extends Model {
  Id?: number;
  standard?: number;
  subject?: number;
}

export const initDTOSStandardSubjectModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOStandardSubject.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
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
      tableName: "standardsubject",
      timestamps: false,
    }
  );
};
