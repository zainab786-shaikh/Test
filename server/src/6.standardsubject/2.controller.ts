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

import { IStandardSubject } from "./0.model";
import { validateStandardSubject } from "./1.validator";
import { IServiceStandardSubject } from "./3.service.model";

@controller("/standardsubject")
export class ControllerStandardSubject extends BaseController {
  private logger: ILogger;
  private serviceStandardSubject: IServiceStandardSubject;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceStandardSubject = container.get(TYPES.ServiceStandardSubject);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  @httpGet("/standard/:Id")
  async getAll(@request() req: Request, @response() res: Response) {
    try {
      const standardId = +req.params.Id;
      const standardsubjectList = await this.serviceStandardSubject.getAll(
        standardId
      );
      this.logger.info(
        "Retrieved standardsubjectList:" + standardsubjectList?.length
      );

      this.setCommonHeaders(res);
      if (!standardsubjectList) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "standardsubjectList not found" });
      }

      res.status(HttpStatusCode.OK).json(standardsubjectList);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:id", validateId)
  async get(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const standardsubject = await this.serviceStandardSubject.get(id);
      this.logger.info("Retrieved standardsubject:" + standardsubject);

      this.setCommonHeaders(res);
      if (!standardsubject) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "StandardSubject not found" });
      }

      res.status(HttpStatusCode.OK).json(standardsubject);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", validateStandardSubject)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const status = await this.serviceStandardSubject.create(req.body);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/:id", validateId, validateStandardSubject)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceStandardSubject.update(id, req.body);
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
      const status = await this.serviceStandardSubject.delete(id);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
