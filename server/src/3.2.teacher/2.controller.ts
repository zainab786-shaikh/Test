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

import { ITeacher } from "./0.model";
import { validateAdhaar, validateTeacher } from "./1.validator";
import { IServiceTeacher } from "./3.service.model";

@controller("/teacher")
export class ControllerTeacher extends BaseController {
  private logger: ILogger;
  private serviceTeacher: IServiceTeacher;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceTeacher = container.get(TYPES.ServiceTeacher);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  @httpGet("/school/:schoolId/standard/:standardId")
  async getAll(@request() req: Request, @response() res: Response) {
    try {
      const schoolId = +req.params.schoolId;
      const standardId = +req.params.standardId;
      const teacherList = await this.serviceTeacher.getAll(
        schoolId,
        standardId
      );
      this.logger.info("Retrieved teacherList:" + teacherList?.length);

      this.setCommonHeaders(res);
      if (!teacherList) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "teacherList not found" });
      }

      res.status(HttpStatusCode.OK).json(teacherList);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/adhaar/:adhaar", validateAdhaar)
  async getByAdhaar(@request() req: Request, @response() res: Response) {
    try {
      const adhaar = req.params.adhaar;
      const teacher = await this.serviceTeacher.getByAdhaar(adhaar);
      this.logger.info("Retrieved Teacher:" + teacher);

      this.setCommonHeaders(res);
      if (!teacher) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Teacher not found" });
      }

      res.status(HttpStatusCode.OK).json(teacher);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:id", validateId)
  async get(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const teacher = await this.serviceTeacher.get(id);
      this.logger.info("Retrieved teacher:" + teacher);

      this.setCommonHeaders(res);
      if (!teacher) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Teacher not found" });
      }

      res.status(HttpStatusCode.OK).json(teacher);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", validateTeacher)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const teacher = req.body as ITeacher;
      const teacherObj = await this.serviceTeacher.create(teacher);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(teacherObj);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/:id", validateId, validateTeacher)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceTeacher.update(id, req.body);
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
      const status = await this.serviceTeacher.delete(id);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
