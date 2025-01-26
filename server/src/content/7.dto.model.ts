
  import { Sequelize, Model, DataTypes } from "sequelize";
  import { IContent } from "./0.model";

  export class DTOContent extends Model {
    Id?: number;
  Quiz!: string;
  FillBlanks!: string;
  TrueFalse!: string;
  subject?: number;
  }

  export const initDTOContentModel = (
    schemaName: string,
    sequelize: Sequelize
  ) => {
    DTOContent.init(
      {
        Id: {
      type : DataTypes.INTEGER,
      allowNull : true,
      autoIncrement : true,
      primaryKey : true,
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
        tableName: "content",
        timestamps: false,
      }
    );
  };
  