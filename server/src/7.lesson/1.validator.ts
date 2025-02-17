import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const lessonSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  Name: z.string().min(3).max(2048),
  Explanation: z.string().min(3).max(102400),
  Quiz: z.string().min(3).max(102400),
  FillBlanks: z.string().min(3).max(102400),
  TrueFalse: z.string().min(3).max(102400),
  subject: z.number().min(1).max(9999).nullable().optional(),
});

const validateLesson = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    lessonSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateLesson };
