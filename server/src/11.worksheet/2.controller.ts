import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from "inversify-express-utils";
import fs from "fs";
import path from "path";

import { ILogger } from "../common/service/logger.service";
import TYPES from "../ioc/types";
import { container } from "../ioc/container";
import { BaseController } from "../common/base-controller";
import { HttpStatusCode } from "../common/constant/http-status-code";
import { authMiddleware, requireRole } from "../common/middleware/auth.middleware";
import { validateWorksheet } from "./1.validator";
import { IServiceWorksheet } from "./3.service.model";

@controller("/worksheet")
export class ControllerWorksheet extends BaseController {
  private logger: ILogger;
  private serviceWorksheet: IServiceWorksheet;

  constructor() {
    super();
    this.logger = container.get(TYPES.LoggerService);
    this.serviceWorksheet = container.get(TYPES.ServiceWorksheet);
  }

  private setCommonHeaders(res: Response) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000, includeSubDomains"
    );
  }

  @httpGet("/available-questions/:lessonId", authMiddleware, requireRole("teacher"))
  async getAvailableQuestions(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const lessonId = +req.params.lessonId;
      const counts = await this.serviceWorksheet.getAvailableQuestionsCount(lessonId);
      this.setCommonHeaders(res);
      res.status(HttpStatusCode.OK).json(counts);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpPost("/", authMiddleware, requireRole("teacher"), validateWorksheet)
  async create(@request() req: Request, @response() res: Response) {
    try {
      const user = (req as any).user;
      let teacherId = user.referenceId; // use referenceId which maps to the teacher table id

      if (!teacherId && user.userId) {
        const repoLoginDetail = container.get<any>(TYPES.RepoLoginDetail);
        const loginDetail = await repoLoginDetail.getById(user.userId);
        if (loginDetail && loginDetail.adhaar) {
          const repoTeacher = container.get<any>(TYPES.RepoTeacher);
          const teacher = await repoTeacher.getByAdhaar(loginDetail.adhaar);
          if (teacher) {
            teacherId = teacher.Id;
          }
        }
      }

      if (!teacherId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Teacher ID not found in token payload" });
      }

      const result = await this.serviceWorksheet.createWorksheet(teacherId, req.body);
      this.setCommonHeaders(res);

      if ("warning" in result) {
        return res.status(HttpStatusCode.OK).json(result);
      }

      res.status(HttpStatusCode.OK).json({
        message: "Worksheet generated successfully",
        worksheet: result.worksheet,
        zipUrl: `/v1/worksheet/download/${result.worksheet.Id}`,
      });
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }

  @httpGet("/download/:id", authMiddleware)
  async download(@request() req: Request, @response() res: Response) {
    try {
      const id = +req.params.id;
      const zipPath = path.join(process.cwd(), "downloads", `Worksheet_${id}.zip`);
      this.setCommonHeaders(res);

      if (!fs.existsSync(zipPath)) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Worksheet ZIP file not found" });
      }

      res.download(zipPath, `Worksheet_${id}.zip`);
    } catch (error: any) {
      this.logger.error(error);
      return this.handleError(error, res);
    }
  }
}
