import { Request, Response } from "express";
import { 
  controller, 
  httpPost, 
  request, 
  response 
} from "inversify-express-utils";

import { ILogger, LoggerService } from "../common/service/logger.service";
import TYPES from "../ioc/types";
import { container } from "../ioc/container";

import { BaseController } from "../common/base-controller";
import { HttpStatusCode } from "../common/constant/http-status-code";
import { validateAICompare } from "./1.validator";
import { IServiceAI } from "./3.service.model";

@controller("/ai")
export class ControllerAI extends BaseController {
  private serviceAI: IServiceAI;

  constructor() {
    super();
    this.serviceAI = container.get(TYPES.ServiceAI);
  }

  @httpPost("/compare", validateAICompare)
  async compare(@request() req: Request, @response() res: Response) {
    try {
      const result = await this.serviceAI.compare(req.body);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error: any) {
      return this.handleError(error, res);
    }
  }
}