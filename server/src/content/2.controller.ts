
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

  import { IContent } from "./0.model";
  import { validateContent } from "./1.validator";
  import { IServiceContent } from "./3.service.model";

  @controller("/content")
  export class ControllerContent extends BaseController {
    private logger: ILogger;
    private serviceContent: IServiceContent;

    constructor() {
      super();
      this.logger = container.get(TYPES.LoggerService);
      this.serviceContent = container.get(TYPES.ServiceContent);
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
        const contentList = await this.serviceContent.getAll(subjectId);
        this.logger.info("Retrieved contentList:" + contentList?.length );

        this.setCommonHeaders(res);
        if (!contentList) {
          return res
            .status(HttpStatusCode.NOT_FOUND)
            .json({ message: "contentList not found" });
        }

        res.status(HttpStatusCode.OK).json(contentList);
      } catch (error: any) {
        this.logger.error(error);
        return this.handleError(error, res);
      }
    }

    @httpGet("/:id", validateId)
    async get(@request() req: Request, @response() res: Response) {
      try {
        const id = +req.params.id;
        const content = await this.serviceContent.get(id);
        this.logger.info("Retrieved content:" + content);

        this.setCommonHeaders(res);
        if (!content) {
          return res
            .status(HttpStatusCode.NOT_FOUND)
            .json({ message: "Content not found" });
        }

        res.status(HttpStatusCode.OK).json(content);
      } catch (error: any) {
        this.logger.error(error);
        return this.handleError(error, res);
      }
    }

    @httpPost("/", validateContent)
    async create(@request() req: Request, @response() res: Response) {
      try {
        const status = await this.serviceContent.create(req.body);
        this.setCommonHeaders(res);
        res.status(HttpStatusCode.OK).json(status);
      } catch (error: any) {
        this.logger.error(error);
        return this.handleError(error, res);
      }
    }

    @httpPut("/:id", validateId, validateContent)
    async update(@request() req: Request, @response() res: Response) {
      try {
        const id = +req.params.id;
        const status = await this.serviceContent.update(id, req.body);
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
        const status = await this.serviceContent.delete(id);
        this.setCommonHeaders(res);
        res.status(HttpStatusCode.OK).json(status);
      } catch (error: any) {
        this.logger.error(error);
        return this.handleError(error, res);
      }
    }
  }
  