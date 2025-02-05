import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const schoolSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[A-Za-z ]+$/),
  address: z
    .string()
    .min(16)
    .max(255)
    .regex(/^[A-Za-z0-9.\-, ]+$/),
});

const validateSchool = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    schoolSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateSchool };
