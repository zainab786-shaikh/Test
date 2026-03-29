import { Model, Transaction } from "sequelize";
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
      list.map((x) => this.getById(x.Id!))
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

    const section = await Section.findByPk(id);
    if (!section) return null;

    const lessoninfo = await Info.findByPk(section.lessoninfoId);
    const quiz = await Quiz.findByPk(section.quizId);
    const fill = await Fill.findByPk(section.fillblanksId);
    const tf = await TF.findByPk(section.truefalseId);
    const sq = await SQ.findByPk(section.shortquestionId);

    return {
      Id: section.Id,
      name: section.name,
      lessoninfo: lessoninfo?.data,
      quiz: quiz?.data,
      fillblanks: fill?.data,
      truefalse: tf?.data,
      shortquestion: sq?.data,
      subject: section.subject,
      lesson: section.lesson,
    };
  }

  async create(data: ILessonSection, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const info = await Info.create({ data: data.lessoninfo }, { transaction: t });
    const quiz = await Quiz.create({ data: data.quiz }, { transaction: t });
    const fill = await Fill.create({ data: data.fillblanks }, { transaction: t });
    const tf = await TF.create({ data: data.truefalse }, { transaction: t });
    const sq = await SQ.create({ data: data.shortquestion }, { transaction: t });

    const section = await Section.create(
      {
        name: data.name,
        lessoninfoId: info.Id,
        quizId: quiz.Id,
        fillblanksId: fill.Id,
        truefalseId: tf.Id,
        shortquestionId: sq.Id,
        subject: data.subject,
        lesson: data.lesson,
      },
      { transaction: t }
    );

    return this.getById(section.Id!);
  }

  async update(id: number, data: ILessonSection, t?: Transaction) {
    const Section = this.getModel(DTOLessonSection);
    const Info = this.getModel(DTOLessonInfo);
    const Quiz = this.getModel(DTOQuizSet);
    const Fill = this.getModel(DTOFillBlankSet);
    const TF = this.getModel(DTOTrueFalseSet);
    const SQ = this.getModel(DTOShortQuestionSet);

    const section = await Section.findByPk(id);
    if (!section) return 0;

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

    const section = await Section.findByPk(id);
    if (!section) return 0;

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
}