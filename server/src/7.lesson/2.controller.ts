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

import { ILesson } from "./0.model";
import { validateLesson } from "./1.validator";
import { IServiceLesson } from "./3.service.model";

@controller("/lesson")
export class ControllerLesson extends BaseController {
  private logger: ILogger;
  private serviceLesson: IServiceLesson;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceLesson = container.get(TYPES.ServiceLesson);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  @httpGet("/subject/:Id")
  async getAll(@request() req: Request, @response() res: Response) {
    try {
      const subjectId = +req.params.Id;
      const lessonList = await this.serviceLesson.getAll(subjectId);
      this.logger.info("Retrieved lessonList:" + lessonList?.length);

      this.setCommonHeaders(res);
      if (!lessonList) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "lessonList not found" });
      }

      res.status(HttpStatusCode.OK).json(lessonList);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:id", validateId)
  async get(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const lesson = await this.serviceLesson.get(id);
      this.logger.info("Retrieved lesson:" + lesson);

      this.setCommonHeaders(res);
      if (!lesson) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      res.status(HttpStatusCode.OK).json(lesson);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/path/:path", validateId)
  async getByPath(@request() req: Request, @response() res: Response) {
    try {
      const path = req.params.path;
      const lesson = await this.serviceLesson.getByPath(path);
      this.logger.info("Retrieved lesson:" + lesson);

      this.setCommonHeaders(res);
      if (!lesson) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      res.status(HttpStatusCode.OK).json(lesson);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", validateLesson)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const { subjectId, ...lessonData } = req.body;

      if (!subjectId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "subjectId is required" });
      }

      const payload: Partial<ILesson> = {
        ...lessonData,
        subject: subjectId,
      };

      const status = await this.serviceLesson.create(payload);

      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/:id", validateId, validateLesson)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceLesson.update(id, req.body);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/path/:path", validateId, validateLesson)
  async updateByPath(@request() req: Request, @response() res: Response) {
    try {
      const path = req.params.path;
      const status = await this.serviceLesson.updateByPath(path, req.body);
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
      const status = await this.serviceLesson.delete(id);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpDelete("/path/:path", validateId)
  async deleteByPath(@request() req: Request, @response() res: Response) {
    try {
      const path = req.params.path;
      const status = await this.serviceLesson.deleteByPath(path);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
