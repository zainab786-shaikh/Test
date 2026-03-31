import { Sequelize, Model, DataTypes } from "sequelize";
import { ISubject } from "./0.model";

export class DTOSubject extends Model {
  Id?: number;
  path?: string;
  name!: string;
}

export const initDTOSubjectModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOSubject.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "subject",
      timestamps: false,
    }
  );
};
