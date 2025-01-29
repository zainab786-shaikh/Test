import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const progressSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  QuizPercentage: z.number().max(100),
  FillBlanksPercentage: z.number().max(100),
  TrueFalsePercentage: z.number().max(100),
  subject: z.number().min(1).max(9999).nullable().optional(),
  student: z.number().min(1).max(9999).nullable().optional(),
  standard: z.number().min(1).max(9999).nullable().optional(),
  school: z.number().min(1).max(9999).nullable().optional(),
});

const validateProgress = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    progressSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateProgress };
