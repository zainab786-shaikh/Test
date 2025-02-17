export interface ILesson {
  Id?: number;
  Name: string;
  Explanation: string;
  Quiz: string;
  FillBlanks: string;
  TrueFalse: string;
  subject?: number;
}
