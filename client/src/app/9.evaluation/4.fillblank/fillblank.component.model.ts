import { IFillInTheBlank } from '../evaluation.service.model';

export interface IFillBlankComponent extends IFillInTheBlank {
  selectedAnswer: number | null;
  answered: boolean;
  feedback?: string;
  user_answer?: string;
}
