import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const teacherSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[A-Za-z ]+$/),
  adhaar: z.string().regex(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/),
  school: z.number().min(1).max(9999).nullable().optional(),
  standard: z.number().min(1).max(9999).nullable().optional(),
});

const validateTeacher = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    teacherSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

const validateAdhaar = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const adhaar = request.params.adhaar; // Extracting id from URL
    const teacherSchema = z.object({
      adhaar: z.string().regex(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/),
    });

    teacherSchema.parse({ adhaar });
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateTeacher, validateAdhaar };
