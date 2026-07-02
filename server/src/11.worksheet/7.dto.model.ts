import { Sequelize, Model, DataTypes } from "sequelize";

export class DTOWorksheet extends Model {
  Id?: number;
  teacher_id!: number;
  lesson_id!: number;
  title!: string;
  generated_at?: Date;
  student_count!: number;
}

export class DTOWorksheetQuestion extends Model {
  Id?: number;
  worksheet_id!: number;
  student_number!: number;
  lessonsection_id!: number;
  question_type!: string;
  question_index!: number;
}

export const initDTOWorksheetModels = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOWorksheet.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "teacher",
          },
          key: "Id",
        },
      },
      lesson_id: {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      student_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "worksheet",
      timestamps: false,
    }
  );

  DTOWorksheetQuestion.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
      },
      worksheet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "worksheet",
          },
          key: "Id",
        },
        onDelete: "CASCADE",
      },
      student_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lessonsection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "lessonsection",
          },
          key: "Id",
        },
      },
      question_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "worksheet_question",
      timestamps: false,
    }
  );
};
