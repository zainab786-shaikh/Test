export interface ILessonSection {
  Id?: number;
  name: string;
  explanation: string;
  quiz: string;
  fillblanks: string;
  truefalse: string;
  shortquestion: string;
  subject?: number;
  lesson?: number;
}
