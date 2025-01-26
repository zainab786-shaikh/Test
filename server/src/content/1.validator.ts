import { Request, Response, NextFunction } from "express";
  import { z } from "zod";
  import { handleValidationError } from "../common/validation-error";

  const contentSchema = z.object({
  Id: z.number().min(1).max(9999).nullable().optional(),
  Quiz: z.string().min(3).max(2048),
  FillBlanks: z.string().min(3).max(2048),
  TrueFalse: z.string().min(3).max(2048),
  subject: z.number().min(1).max(9999).nullable().optional()
});

  const validateContent = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // Validate request body against schema
      contentSchema.parse(request.body);
      next();
    } catch (error) {
      // Use the common error handler
      handleValidationError(error, response, next);
    }
  };

  export { validateContent };
  