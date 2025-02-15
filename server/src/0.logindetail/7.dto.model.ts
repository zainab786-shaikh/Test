import { Sequelize, Model, DataTypes } from "sequelize";
import { ILoginDetail } from "./0.model";

export class DTOLoginDetail extends Model {
  Id?: number;
  name!: string;
  password!: string;
  role!: string | number | boolean;
}

export const initDTOLoginDetailModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOLoginDetail.init(
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "teacher", "student", "parent"),
        allowNull: false,
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "logindetail",
      timestamps: false,
    }
  );
};
