
  import { Sequelize, Model, DataTypes } from "sequelize";
  import { IStandard } from "./0.model";

  export class DTOStandard extends Model {
    Id?: number;
  name!: string;
  school?: number;
  }

  export const initDTOStandardModel = (
    schemaName: string,
    sequelize: Sequelize
  ) => {
    DTOStandard.init(
      {
        Id: {
      type : DataTypes.INTEGER,
      allowNull : true,
      autoIncrement : true,
      primaryKey : true,
    },
        name: {
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
      },
      {
        sequelize,
        schema: schemaName,
        tableName: "standard",
        timestamps: false,
      }
    );
  };
  