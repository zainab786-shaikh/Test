import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const aiCompareSchema = z.object({
  answer: z.string().min(1),
  user_answer: z.string().min(1),
});

const validateAICompare = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    aiCompareSchema.parse(request.body);
    next();
  } catch (error) {
    handleValidationError(error, response, next);
  }
};

export { validateAICompare };