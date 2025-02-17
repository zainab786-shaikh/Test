import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { IQuizComponent } from './quiz.component.model';

@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  quizzes: IQuizComponent[] = [];

  constructor(private evalationService: EvaluationService) {}

  private load() {
    this.evalationService.getQuizzes().subscribe((data) => {
      this.quizzes = data.map((q) => ({
        ...q,
        selectedAnswer: null,
        answered: false,
      }));
    });
  }
  
  ngOnInit() {
    this.load();
  }

  resetQuiz() {
    this.load();
  }

  submitAnswers() {
    this.quizzes.forEach((quiz) => {
      quiz.answered = true;
    });
  }
  isAnyQuizAttempted(): boolean {
    return this.quizzes.some((quiz) => quiz.selectedAnswer !== null);
  }
}
