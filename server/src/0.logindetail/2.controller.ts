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
import { validateId, validateName } from "../common/validator-id";

import { ILoginDetail } from "./0.model";
import { validateLoginData, validateLoginDetail } from "./1.validator";
import { IServiceLoginDetail } from "./3.service.model";

@controller("/logindetail")
export class ControllerLoginDetail extends BaseController {
  private logger: ILogger;
  private serviceLoginDetail: IServiceLoginDetail;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceLoginDetail = container.get(TYPES.ServiceLoginDetail);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  @httpGet("/")
  async getAll(@request() req: Request, @response() res: Response) {
    try {
      const logindetailList = await this.serviceLoginDetail.getAll();
      this.logger.info("Retrieved logindetailList:" + logindetailList?.length);

      this.setCommonHeaders(res);
      if (!logindetailList) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "logindetailList not found" });
      }

      res.status(HttpStatusCode.OK).json(logindetailList);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/:id", validateId)
  async get(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const logindetail = await this.serviceLoginDetail.get(id);
      this.logger.info("Retrieved logindetail:" + logindetail);

      this.setCommonHeaders(res);
      if (!logindetail) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "LoginDetail not found" });
      }

      res.status(HttpStatusCode.OK).json(logindetail);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/user/:name", validateName)
  async getByUser(@request() req: Request, @response() res: Response) {
    try {
      const username = req.params.name;
      const logindetail = await this.serviceLoginDetail.getByName(username);
      this.logger.info("Retrieved logindetail:" + logindetail);

      this.setCommonHeaders(res);
      if (!logindetail) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "LoginDetail not found" });
      }

      res.status(HttpStatusCode.OK).json(logindetail);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/validate", validateLoginData)
  async validate(@request() req: Request, @response() res: Response) {
    try {
      const username = req.body.name;
      const password = req.body.password;
      const user = await this.serviceLoginDetail.validate(username, password);

      this.setCommonHeaders(res);

      if (!user) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = this.serviceLoginDetail.generateToken(user);

      // Return user data with token
      const response = {
        token,
        user: {
          id: user.Id,
          name: user.name,
          role: user.role,
          referenceId: user.referenceId,
        },
      };

      this.logger.info(`User authenticated: ${username}`);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", validateLoginDetail)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const status = await this.serviceLoginDetail.create(req.body);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPut("/:id", validateId, validateLoginDetail)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const status = await this.serviceLoginDetail.update(id, req.body);
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
      const status = await this.serviceLoginDetail.delete(id);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(status);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
