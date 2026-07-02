import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const worksheetSchema = z.object({
  title: z.string().min(3).max(255),
  lessonId: z.number().int().positive(),
  studentCount: z.number().int().positive().min(1).max(500),
  totalMarks: z.number().int().positive().optional().nullable(),
  quantities: z.object({
    MCQ: z.number().int().nonnegative().default(0),
    TRUE_FALSE: z.number().int().nonnegative().default(0),
    FILL_BLANK: z.number().int().nonnegative().default(0),
    SHORT_ANSWER: z.number().int().nonnegative().default(0),
  }),
  allowReuse: z.boolean().default(false),
});

const validateWorksheet = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    worksheetSchema.parse(request.body);
    next();
  } catch (error) {
    handleValidationError(error, response, next);
  }
};

export { validateWorksheet };
