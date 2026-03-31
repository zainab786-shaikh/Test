import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
  request,
  response,
  httpPut,
} from "inversify-express-utils";

import { ILogger, LoggerService } from "../common/service/logger.service";
import TYPES from "../ioc/types";
import { container } from "../ioc/container";

import { BaseController } from "../common/base-controller";
import { HttpStatusCode } from "../common/constant/http-status-code";
import { validateId } from "../common/validator-id";

import { ILessonSection } from "./0.model";
import { validateLessonSection } from "./1.validator";
import { IServiceLessonSection } from "./3.service.model";

@controller("/lessonsection")
export class ControllerLessonSection extends BaseController {
  private logger: ILogger;
  private serviceLessonSection: IServiceLessonSection;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceLessonSection = container.get(TYPES.ServiceLessonSection);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  private NUMBER_OF_QUESTIONS = 3;

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private shuffleOptions(item: any) {
    if (!item.options) return item;

    const options = [...item.options];
    const correct = options[item.answer];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      ...item,
      options,
      answer: options.indexOf(correct),
    };
  }

  @httpGet("/:Id/lessoninfo")
  async getLessonInfo(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionId = +req.params.Id;
      const lessonSection = await this.serviceLessonSection.get(
        lessonSectionId
      );
      this.logger.info("Retrieved Lesson Info:" + lessonSection?.lessoninfo);

      this.setCommonHeaders(res);
      if (!lessonSection?.lessoninfo) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      res.status(HttpStatusCode.OK).json(lessonSection?.lessoninfo);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path/lessoninfo")
  async getLessonInfoByPath(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionPath = req.params.path;
      const lessonSection = await this.serviceLessonSection.getByPath(
        lessonSectionPath
      );
      this.logger.info("Retrieved Lesson Info:" + lessonSection?.lessoninfo);

      this.setCommonHeaders(res);
      if (!lessonSection?.lessoninfo) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      res.status(HttpStatusCode.OK).json(lessonSection?.lessoninfo);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:Id/quiz")
  async getQuiz(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionId = +req.params.Id;
      const lessonSection = await this.serviceLessonSection.get(
        lessonSectionId
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.quiz);

      this.setCommonHeaders(res);
      if (!lessonSection?.quiz) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const quizzes = lessonSection.quiz as any[];
      const result = this.shuffleArray(quizzes)
        .map((q) => this.shuffleOptions(q))
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path/quiz")
  async getQuizByPath(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionPath = req.params.path;
      const lessonSection = await this.serviceLessonSection.getByPath(
        lessonSectionPath
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.quiz);

      this.setCommonHeaders(res);
      if (!lessonSection?.quiz) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const quizzes = lessonSection.quiz as any[];
      const result = this.shuffleArray(quizzes)
        .map((q) => this.shuffleOptions(q))
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:Id/fillblank")
  async getFillBlank(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionId = +req.params.Id;
      const lessonSection = await this.serviceLessonSection.get(
        lessonSectionId
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.fillblanks);

      this.setCommonHeaders(res);
      if (!lessonSection?.fillblanks) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const result = this.shuffleArray(lessonSection.fillblanks)
        .map((q) => this.shuffleOptions(q))
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path/fillblank")
  async getFillBlankByPath(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionPath = req.params.path;
      const lessonSection = await this.serviceLessonSection.getByPath(
        lessonSectionPath
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.fillblanks);

      this.setCommonHeaders(res);
      if (!lessonSection?.fillblanks) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const result = this.shuffleArray(lessonSection.fillblanks)
        .map((q) => this.shuffleOptions(q))
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:Id/truefalse")
  async getTrueFalse(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionId = +req.params.Id;
      const lessonSection = await this.serviceLessonSection.get(
        lessonSectionId
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.truefalse);

      this.setCommonHeaders(res);
      if (!lessonSection?.truefalse) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const tf = lessonSection.truefalse as any[];
      const result = this.shuffleArray(tf)
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path/truefalse")
  async getTrueFalseByPath(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionPath = req.params.path;
      const lessonSection = await this.serviceLessonSection.getByPath(
        lessonSectionPath
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.truefalse);

      this.setCommonHeaders(res);
      if (!lessonSection?.truefalse) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const tf = lessonSection.truefalse as any[];
      const result = this.shuffleArray(tf)
        .slice(0, this.NUMBER_OF_QUESTIONS);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:Id/shortquestion")
  async getShortQuestion(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionId = +req.params.Id;
      const lessonSection = await this.serviceLessonSection.get(
        lessonSectionId
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.shortquestion);

      this.setCommonHeaders(res);
      if (!lessonSection?.shortquestion) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const sq = lessonSection.shortquestion as any[];
      const result = this.shuffleArray(sq)
        .slice(0, this.NUMBER_OF_QUESTIONS);


      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path/shortquestion")
  async getShortQuestionByPath(@request() req: Request, @response() res: Response) {
    try {
      const lessonSectionPath = req.params.path;
      const lessonSection = await this.serviceLessonSection.getByPath(
        lessonSectionPath
      );
      this.logger.info("Retrieved Explanation:" + lessonSection?.shortquestion);

      this.setCommonHeaders(res);
      if (!lessonSection?.shortquestion) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      const sq = lessonSection.shortquestion as any[];
      const result = this.shuffleArray(sq)
        .slice(0, this.NUMBER_OF_QUESTIONS);


      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/subject/:subjectId/lesson/:lessonId/")
  async getAll(@request() req: Request, @response() res: Response) {
    try {
      const subjectId = +req.params.subjectId;
      const lessonId = +req.params.lessonId;
      const lessonSectionList = await this.serviceLessonSection.getAll(
        subjectId,
        lessonId
      );
      this.logger.info("Retrieved lessonList:" + lessonSectionList?.length);

      this.setCommonHeaders(res);
      if (!lessonSectionList) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      res.status(HttpStatusCode.OK).json(lessonSectionList);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:id", validateId)
  async get(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const lessonSection = await this.serviceLessonSection.get(id);
      this.logger.info("Retrieved lesson:" + lessonSection);

      this.setCommonHeaders(res);
      if (!lessonSection) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      res.status(HttpStatusCode.OK).json(lessonSection);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", validateLessonSection)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const { subjectId, lessonId, ...sectionData } = req.body;

      if (!subjectId || !lessonId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "subjectId and lessonId are required",
        });
      }

      const payload: Partial<ILessonSection> = {
        ...sectionData,
        subject: subjectId,
        lesson: lessonId,
      };

      const status = await this.serviceLessonSection.create(payload);

      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/:id", validateId, validateLessonSection)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceLessonSection.update(id, req.body);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpDelete("/:id", validateId)
  async delete(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceLessonSection.delete(id);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
