import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const logindetailSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[A-Za-z ]+$/),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/^[A-Za-z0-9'.\-, ]+$/),
  role: z.enum(["admin", "teacher", "student", "parent"]),
});

const validateLoginDetail = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against schema
    logindetailSchema.parse(request.body);
    next();
  } catch (error) {
    // Use the common error handler
    handleValidationError(error, response, next);
  }
};

export { validateLoginDetail };
