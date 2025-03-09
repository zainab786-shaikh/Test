import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFillInTheBlank, IQuiz, ITrueFalse } from './evaluation.service.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = 'http://localhost:3000/v1/lessonsection';
  NUMBER_OF_QUESTIONS = 3;

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  constructor(private http: HttpClient) {}

  private shuffleOptions(quiz: IQuiz): IQuiz {
    const options = [...quiz.options];
    const correctAnswer = options[quiz.answer];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { ...quiz, options, answer: options.indexOf(correctAnswer) };
  }

  getQuizzes(lessonSectionId: number): Observable<IQuiz[]> {
    return this.http
      .get<string>(`${this.apiUrl}/${lessonSectionId}/quiz`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          const quizzes: IQuiz[] = JSON.parse(response);
          return quizzes
            .map((quiz) => this.shuffleOptions(quiz))
            .slice(0, this.NUMBER_OF_QUESTIONS); // Return only the first 3 quizzes
        })
      );
  }

  getFillBlanks(lessonSectionId: number): Observable<IFillInTheBlank[]> {
    return this.http
      .get<string>(`${this.apiUrl}/${lessonSectionId}/fillblank`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          const fillBlanks: IFillInTheBlank[] = JSON.parse(response);
          return fillBlanks.slice(0, this.NUMBER_OF_QUESTIONS); // Return only the first 3 fill-in-the-blanks
        })
      );
  }

  getTrueFalse(lessonSectionId: number): Observable<ITrueFalse[]> {
    return this.http
      .get<string>(`${this.apiUrl}/${lessonSectionId}/truefalse`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          const trueFalseQuestions: ITrueFalse[] = JSON.parse(response);
          return trueFalseQuestions.slice(0, this.NUMBER_OF_QUESTIONS); // Return only the first 3 true/false questions
        })
      );
  }

  getLessonExplanation(lessonSectionId: number): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/${lessonSectionId}/explanation`,
      {
        headers: this.headers,
      }
    );
  }
}
