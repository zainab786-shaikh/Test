import { Model, Transaction, Op } from "sequelize";
import { injectable } from "inversify";
import { ILessonSection } from "./0.model";
import { IRepoLessonSection } from "./5.repo.model";
import {
  DTOLessonSection,
  DTOLessonInfo,
  DTOQuizSet,
  DTOFillBlankSet,
  DTOTrueFalseSet,
  DTOShortQuestionSet,
} from "./7.dto.model";
import { RequestContextProvider } from "../common/service/request-context.service";
import { container } from "../ioc/container";
import { generateNextCode } from "../common/utility/common-utils";

@injectable()
export class RepoLessonSectionImpl implements IRepoLessonSection {

  private getModel<T extends typeof Model>(model: T): T {
    const contextProvider = container.get(RequestContextProvider);
    const context = contextProvider.get();
    return context?.databaseConnection.model(model.name) as T;
  }

  async isExist(id: number): Promise<boolean> {
    const Model = this.getModel(DTOLessonSection);
    return (await Model.findByPk(id)) !== null;
  }

  async getAll(
    inSubjectId: number,
    inLessonId: number
  ): Promise<ILessonSection[] | null> {

    const Model = this.getModel(DTOLessonSection);

    const list = await Model.findAll({
      where: {
        subject: inSubjectId,
        lesson: inLessonId,
      },
    });

    const results = await Promise.all(
      list.map((x) => this.getById(x.get("Id") as number))
    );

    return results.filter((x): x is ILessonSection => x !== null);
  }

  async getById(id: number): Promise<ILessonSection | null> {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const sectionInstance = await Section.findByPk(id);
    if (!sectionInstance) return null;

    const section = sectionInstance.get();

    const lessoninfo = section.lessoninfoId
      ? await Info.findByPk(section.lessoninfoId)
      : null;

    const quiz = section.quizId
      ? await Quiz.findByPk(section.quizId)
      : null;

    const fill = section.fillblanksId
      ? await Fill.findByPk(section.fillblanksId)
      : null;

    const tf = section.truefalseId
      ? await TF.findByPk(section.truefalseId)
      : null;

    const sq = section.shortquestionId
      ? await SQ.findByPk(section.shortquestionId)
      : null;

    return {
      Id: section.Id,
      name: section.name,
      lessoninfo: lessoninfo?.get("data"),
      quiz: quiz?.get("data"),
      fillblanks: fill?.get("data"),
      truefalse: tf?.get("data"),
      shortquestion: sq?.get("data"),
      subject: section.subject,
      lesson: section.lesson,
    };
  }

  async getByPath(path: string): Promise<ILessonSection | null> {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const sectionInstance = await Section.findOne({ where: { path } });
    if (!sectionInstance) return null;

    const section = sectionInstance.get();

    const lessoninfo = await Info.findOne({ where: { path } });
    const quiz = await Quiz.findOne({ where: { path } });
    const fill = await Fill.findOne({ where: { path } });
    const tf = await TF.findOne({ where: { path } });
    const sq = await SQ.findOne({ where: { path } });

    return {
      Id: section.Id,
      name: section.name,
      lessoninfo: lessoninfo?.get("data"),
      quiz: quiz?.get("data"),
      fillblanks: fill?.get("data"),
      truefalse: tf?.get("data"),
      shortquestion: sq?.get("data"),
      subject: section.subject,
      lesson: section.lesson,
    };
  }

  async create(data: Partial<ILessonSection>, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);
    const LessonModel = this.getModel<any>("DTOLesson" as any);

    if (!data.lesson || !data.subject) {
      throw new Error("lesson and subject are required");
    }

    const lesson = await LessonModel.findOne({
      where: { Id: data.lesson },
      transaction: t,
    });

    if (!lesson?.path) {
      throw new Error("Invalid lesson");
    }

    const lessonPath = lesson.path;

    const lastSection = await Section.findOne({
      where: {
        path: {
          [Op.like]: `${lessonPath}.S%`,
        },
      },
      order: [["path", "DESC"]],
      transaction: t,
    });

    const nextSectionCode = generateNextCode(
      "S",
      lastSection?.get("path")?.split(".").pop()
    );

    const fullPath = `${lessonPath}.${nextSectionCode}`;

    const info = await Info.create(
      { data: data.lessoninfo, path: fullPath },
      { transaction: t }
    );

    const quiz = await Quiz.create(
      { data: data.quiz, path: fullPath },
      { transaction: t }
    );

    const fill = await Fill.create(
      { data: data.fillblanks, path: fullPath },
      { transaction: t }
    );

    const tf = await TF.create(
      { data: data.truefalse, path: fullPath },
      { transaction: t }
    );

    const sq = await SQ.create(
      { data: data.shortquestion, path: fullPath },
      { transaction: t }
    );

    const section = await Section.create(
      {
        name: data.name,
        path: fullPath,
        lessoninfoId: info.get("Id"),
        quizId: quiz.get("Id"),
        fillblanksId: fill.get("Id"),
        truefalseId: tf.get("Id"),
        shortquestionId: sq.get("Id"),
        subject: data.subject,
        lesson: data.lesson,
      },
      { transaction: t }
    );

    return this.getById(section.get("Id") as number);
  }

  async updateByPath(path: string, data: ILessonSection, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);

    const section = await Section.findOne({ where: { path } });
    if (!section) return 0;

    await Section.update(
      {
        name: data.name,
        subject: data.subject,
        lesson: data.lesson,
      },
      { where: { path }, transaction: t } // ✅ FIXED BUG
    );

    return 1;
  }
  async update(id: number, data: ILessonSection, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const sectionInstance = await Section.findByPk(id);
    if (!sectionInstance) return 0;

    const section = sectionInstance.get();

    await Info.update(
      { data: data.lessoninfo },
      { where: { Id: section.lessoninfoId }, transaction: t }
    );

    await Quiz.update(
      { data: data.quiz },
      { where: { Id: section.quizId }, transaction: t }
    );

    await Fill.update(
      { data: data.fillblanks },
      { where: { Id: section.fillblanksId }, transaction: t }
    );

    await TF.update(
      { data: data.truefalse },
      { where: { Id: section.truefalseId }, transaction: t }
    );

    await SQ.update(
      { data: data.shortquestion },
      { where: { Id: section.shortquestionId }, transaction: t }
    );

    await Section.update(
      {
        name: data.name,
        subject: data.subject,
        lesson: data.lesson,
      },
      { where: { Id: id }, transaction: t }
    );

    return 1;
  }

  async delete(id: number, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const sectionInstance = await Section.findByPk(id);
    if (!sectionInstance) return 0;

    const section = sectionInstance.get();

    await Info.destroy({ where: { Id: section.lessoninfoId }, transaction: t });
    await Quiz.destroy({ where: { Id: section.quizId }, transaction: t });
    await Fill.destroy({ where: { Id: section.fillblanksId }, transaction: t });
    await TF.destroy({ where: { Id: section.truefalseId }, transaction: t });
    await SQ.destroy({ where: { Id: section.shortquestionId }, transaction: t });

    return Section.destroy({
      where: { Id: id },
      transaction: t,
    });
  }

  async deleteByPath(path: string, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const section = await Section.findOne({ where: { path } });
    if (!section) return 0;

    await Info.destroy({ where: { path }, transaction: t });
    await Quiz.destroy({ where: { path }, transaction: t });
    await Fill.destroy({ where: { path }, transaction: t });
    await TF.destroy({ where: { path }, transaction: t });
    await SQ.destroy({ where: { path }, transaction: t });

    return Section.destroy({
      where: { path },
      transaction: t,
    });
  }
}