import { IShortQuestion } from "../evaluation.service.model";

export interface IShortQuestionComponent extends IShortQuestion {

  answered: boolean;
  feedback?: string;
  user_answer?: string;
}