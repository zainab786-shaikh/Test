export interface IFillBlankComponent {
  id: number;
  question: string;
  options: string[];
  answer: number;
  selectedAnswer: number | null;
  answered: boolean;
  feedback?: string; // Add feedback property
}
