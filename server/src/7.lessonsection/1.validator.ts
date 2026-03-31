import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { handleValidationError } from "../common/validation-error";

const lessonInfoSchema = z.object({
  id: z.number().optional(),
  paragraph: z.string().min(3),
  explanation: z.string().min(3),
  summary: z.string().min(3),
  examples: z.string().min(3),
});

const quizSchema = z.object({
  id: z.number().optional(),
  question: z.string().min(3),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  answer_embedding: z.array(z.number()).optional(),
  explanation: z.string().min(3),
});

const fillBlankSchema = z.object({
  id: z.number().optional(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.number(),
  answer_embedding: z.array(z.number()).optional(),
});

const trueFalseSchema = z.object({
  id: z.number().optional(),
  question: z.string(),
  answer: z.boolean(),
});

const shortQuestionSchema = z.object({
  id: z.number().optional(),
  question: z.string(),
  answer: z.string(),
  answer_embedding: z.array(z.number()).optional(),
});

const lessonsectionSchema = z.object({
  Id: z.number().optional(),
  path: z.string().min(3),
  name: z.string().min(3),
  lessoninfo: lessonInfoSchema,
  quiz: z.array(quizSchema),
  fillblanks: z.array(fillBlankSchema),
  truefalse: z.array(trueFalseSchema),
  shortquestion: z.array(shortQuestionSchema),
  subject: z.number().optional(),
  lesson: z.number().optional(),
});

const validateLessonSection = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    lessonsectionSchema.parse(request.body);
    next();
  } catch (error) {
    handleValidationError(error, response, next);
  }
};

export { validateLessonSection };