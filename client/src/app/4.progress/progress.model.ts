export interface IProgress {
  Id?: number;
  quiz: number;
  fillblanks: number;
  truefalse: number;
  score?: number; // Add this property
  school?: number;
  standard?: number;
  student?: number;
  subject?: number;
  lesson?: number;
  lessonsection?: number;
}
