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
  data!: ILessonInfo;
}

/* ---------- QUIZ ---------- */
export class DTOQuizSet extends Model {
  Id?: number;
  data!: IQuiz[];
}

/* ---------- FILLBLANK ---------- */
export class DTOFillBlankSet extends Model {
  Id?: number;
  data!: IFillInTheBlank[];
}

/* ---------- TRUEFALSE ---------- */
export class DTOTrueFalseSet extends Model {
  Id?: number;
  data!: ITrueFalse[];
}

/* ---------- SHORT QUESTION ---------- */
export class DTOShortQuestionSet extends Model {
  Id?: number;
  data!: IShortQuestion[];
}

/* ---------- INIT ---------- */
export const initDTOLessonSectionModel = (
  schemaName: string,
  sequelize: Sequelize
) => {
  DTOLessonSection.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },

      lessoninfoId: { type: DataTypes.INTEGER, allowNull: false },
      quizId: { type: DataTypes.INTEGER, allowNull: false },
      fillblanksId: { type: DataTypes.INTEGER, allowNull: false },
      truefalseId: { type: DataTypes.INTEGER, allowNull: false },
      shortquestionId: { type: DataTypes.INTEGER, allowNull: false },

      subject: { type: DataTypes.INTEGER, allowNull: false },
      lesson: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection",
      timestamps: false,
    }
  );

  DTOLessonInfo.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_lessoninfo",
      timestamps: false,
    }
  );

  DTOQuizSet.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_quiz",
      timestamps: false,
    }
  );

  DTOFillBlankSet.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_fillblanks",
      timestamps: false,
    }
  );

  DTOTrueFalseSet.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_truefalse",
      timestamps: false,
    }
  );

  DTOShortQuestionSet.init(
    {
      Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      data: { type: DataTypes.JSONB, allowNull: false },
    },
    {
      sequelize,
      schema: schemaName,
      tableName: "lessonsection_shortquestion",
      timestamps: false,
    }
  );
};