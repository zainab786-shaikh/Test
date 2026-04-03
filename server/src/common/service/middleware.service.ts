import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../ioc/types";
import { container } from "../../ioc/container";

import { ILogger } from "./logger.service";
import { CONSTANT } from "../constant/constant";

import { ServiceTenant } from "./tenant.service";
import { HttpStatusCode } from "../constant/http-status-code";
import { RequestContextProvider } from "./request-context.service";
import { RequestContext } from "./request-context.service";
import { Validate } from "../validate";

@injectable()
export class MiddlewareProvider {
  private logger: ILogger;
  private tenantService: ServiceTenant;
  private validate: Validate;

  constructor(
    @inject(TYPES.LoggerService) logger: ILogger,
    @inject(ServiceTenant) tenantService: ServiceTenant,
    @inject(Validate) validate: Validate
  ) {
    this.logger = logger;
    this.tenantService = tenantService;
    this.validate = validate;

    this.middlewareValidateTenant = this.middlewareValidateTenant.bind(this);
    this.middlewareException = this.middlewareException.bind(this);
  }

  // Middleware to handle exception and modify response body
  public middlewareException(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.logger.error(`Error encountered: ${err.message || err}`);

    res.setHeader(
      CONSTANT.SECURITY.STRICT_TRANSPORT_SECURITY,
      CONSTANT.SECURITY.MAX_AGE
    );

    const statusCode = err.status || err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
      code: statusCode,
      error: err.message || "Internal Server Error",
    });
  }

  // Main middleware to validate tenant information
  public async middlewareValidateTenant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      this.validate.headers(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
