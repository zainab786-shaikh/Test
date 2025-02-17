import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../evaluation.service'; // Import service if you are fetching the data from backend
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ITrueFalseComponent } from './truefalse.component.model';

@Component({
  selector: 'app-truefalse',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './truefalse.component.html',
  styleUrls: ['./truefalse.component.css'],
})
export class TrueFalseComponent implements OnInit {
  trueFalseQuestions: ITrueFalseComponent[] = [];

  constructor(private evaluationService: EvaluationService) {}

  // Load the questions
  private load() {
    this.evaluationService.getTrueFalse().subscribe((data) => {
      this.trueFalseQuestions = data.map((q) => ({
        ...q,
        selectedAnswer: null,
        answered: false,
      }));
    });
  }

  ngOnInit() {
    this.load();
  }

  // Handle Submit
  submitAnswers() {
    this.trueFalseQuestions.forEach((question) => {
      question.answered = true;
    });
  }

  // Reset the questions
  resetTrueFalse() {
    this.load();
  }

  // Check if any answer has been selected
  isAnyAnswerSelected(): boolean {
    return this.trueFalseQuestions.some(
      (question) => question.selectedAnswer !== null
    );
  }
}
