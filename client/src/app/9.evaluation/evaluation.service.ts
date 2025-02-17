import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  constructor() {}

  private quizzes = [
    {
      id: 1,
      question: "What is the Ice-cream Man's cart described as?",
      options: [
        'A bed of roses',
        'A flower bed',
        'A bed of tulips',
        'A bed of daisies',
      ],
      answer: 2,
    },
    {
      id: 2,
      question: 'Which ice cream flavors does the Ice-cream Man sell?',
      options: [
        'Vanilla only',
        'Vanilla, chocolate, strawberry',
        'Chocolate only',
        'Strawberry only',
      ],
      answer: 2,
    },
  ];

  private shuffleOptions(quiz: any) {
    const options = [...quiz.options];
    const correctAnswer = options[quiz.answer];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    quiz.answer = options.indexOf(correctAnswer);
    quiz.options = options;
  }

  getQuizzes(): Observable<any[]> {
    const shuffledQuizzes = this.quizzes.map((quiz) => {
      const shuffledQuiz = { ...quiz };
      this.shuffleOptions(shuffledQuiz);
      return shuffledQuiz;
    });
    return of(shuffledQuizzes);
  }

  getFillBlanks() {
    return of([
      {
        id: 1,
        question:
          'The Ice Cream Man’s cart represents a ________ in the community.',
        options: [
          'source of income',
          'symbol of joy',
          'place of business',
          'vehicle for deliveries',
        ],
        answer: 2,
      },
      {
        id: 2,
        question:
          'The cart offers a service that is _______ to children in the neighborhood.',
        options: ['inaccessible', 'inconvenient', 'costly', 'convenient'],
        answer: 4,
      },
    ]);
  }

  getTrueFalse() {
    return of([
      {
        id: 1,
        question:
          'It is true that the Ice Cream Man goes down the street when the summer’s heat is high.',
        answer: true,
      },
      {
        id: 2,
        question:
          'It is false that the Ice Cream Man travels around in a large truck.',
        answer: true,
      },
    ]);
  }
}
