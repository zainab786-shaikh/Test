export interface ILessonInfo {
  id: number; 
  explanation: string; 
  summary: string; 
  examples: string;
} 

export interface IFillInTheBlank { 
  id: number; 
  question: string; 
  options: string[]; 
  answer: string; 
  answer_embedding?: number[]; 
} 

export interface ITrueFalse { 
  id: number; 
  question: string; 
  answer: string; 
  answer_embedding?: number[]; 
} 

export interface IQuiz { 
  id: number; 
  question: string; 
  options: string[]; 
  answer: string; 
  answer_embedding?: number[]; 
} 
  
export interface IShortQuestion { 
  id: number; 
  question: string; 
  answer: string; 
  answer_embedding?: number[]; 
}

export interface ILessonSection {
  Id?: number;
  name: string;
  lessoninfo: ILessonInfo|undefined;
  quiz: IQuiz[] |undefined;
  fillblanks: IFillInTheBlank[]|undefined;
  truefalse: ITrueFalse[]|undefined;
  shortquestion: IShortQuestion[]|undefined;
  subject?: number;
  lesson?: number;
}