import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const standardsubjectSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  standard: z.number().min(1).max(9999).nullable().optional(),
  subject: z.number().min(1).max(9999).nullable().optional(),
});

const validateStandardSubject = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    standardsubjectSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateStandardSubject };
