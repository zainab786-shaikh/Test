export interface IAICompareRequest {
  answer: string;
  user_answer: string;
}

export interface IAICompareResponse {
  match: boolean;
  score: number;
}