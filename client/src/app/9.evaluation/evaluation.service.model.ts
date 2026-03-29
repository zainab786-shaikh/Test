export interface IFillInTheBlank {
  id: number;
  question: string;
  options: string[];
  answer: number;
  answer_embedding?: number[];
}
export interface ITrueFalse {
  id: number;
  question: string;
  answer: boolean;
  answer_embedding?: number[];
}

export interface IQuiz {
  id: number;
  question: string;
  options: string[];
  answer: number;
  answer_embedding?: number[];
}

export interface IShortQuestion {
  id: number;
  question: string;
  answer: string;
  answer_embedding?: number[];
}


