import { Sequelize, Model, DataTypes } from "sequelize";
import {
  ILessonInfo,
  IQuiz,
  IFillInTheBlank,
  ITrueFalse,
  IShortQuestion,
} from "./0.model";

/* ---------- LESSON SECTION (MAIN) ---------- */
export class DTOLessonSection extends Model {
  Id?: number;
  path?: string;
  name!: string;
  lessoninfoId!: number;
  quizId!: number;
  fillblanksId!: number;
  truefalseId!: number;
  shortquestionId!: number;
  subject!: number;
  lesson!: number;
}

/* ---------- LESSON INFO ---------- */
export class DTOLessonInfo extends Model {
  Id?: number;
  path?: string;
  data!: ILessonInfo;
}

/* ---------- QUIZ ---------- */
export class DTOQuizSet extends Model {
  Id?: number;
  path?: string;
  data!: IQuiz[];
}

/* ---------- FILLBLANK ---------- */
export class DTOFillBlankSet extends Model {
  Id?: number;
  path?: string;
  data!: IFillInTheBlank[];
}

/* ---------- TRUEFALSE ---------- */
export class DTOTrueFalseSet extends Model {
  Id?: number;
  path?: string;
  data!: ITrueFalse[];
}

/* ---------- SHORT QUESTION ---------- */
export class DTOShortQuestionSet extends Model {
  Id?: number;
  path?: string;
  data!: IShortQuestion[];
}

/* ---------- INIT ---------- */
export const initDTOLessonSectionModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  const getBaseIdColumn = () => ({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    allowNull: false,
    field: "Id",
  });

  DTOLessonSection.init(
    {
      Id: getBaseIdColumn(),
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      path: { type: DataTypes.STRING, allowNull: false, unique: true },

      lessoninfoId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      quizId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      fillblanksId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      truefalseId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      shortquestionId: { type: DataTypes.INTEGER, allowNull: true, unique: true },

      subject: { type: DataTypes.INTEGER, allowNull: false },
      lesson: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection",
      timestamps: false,
      freezeTableName: true,
    }
  );

  DTOLessonInfo.init(
    {
      Id: getBaseIdColumn(),
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_lessoninfo",
      timestamps: false,
      freezeTableName: true,
    }
  );

  DTOQuizSet.init(
    {
      Id: getBaseIdColumn(),
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_quiz",
      timestamps: false,
      freezeTableName: true,
    }
  );

  DTOFillBlankSet.init(
    {
      Id: getBaseIdColumn(),
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_fillblanks",
      timestamps: false,
      freezeTableName: true,
    }
  );

  DTOTrueFalseSet.init(
    {
      Id: getBaseIdColumn(),
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_truefalse",
      timestamps: false,
      freezeTableName: true,
    }
  );

  DTOShortQuestionSet.init(
    {
      Id: getBaseIdColumn(),
      path: { type: DataTypes.STRING, allowNull: false, unique: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_shortquestion",
      timestamps: false,
      freezeTableName: true,
    }
  );
};