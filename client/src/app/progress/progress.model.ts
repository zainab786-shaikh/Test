export interface IProgress {
  Id?: number;
  QuizPercentage: number;
  FillBlanksPercentage: number;
  TrueFalsePercentage: number;
  subject?: number;
  student?: number;
  standard?: number;
  school?: number;
}
