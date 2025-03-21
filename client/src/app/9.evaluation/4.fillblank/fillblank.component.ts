import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { IFillBlankComponent } from './fillblank.component.model';

@Component({
  selector: 'app-fillblank',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './fillblank.component.html',
  styleUrl: './fillblank.component.css',
})
export class FillBlankComponent implements OnInit {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Output() score = new EventEmitter<number>(); // Ensure this emits a number

  fillBlanks: IFillBlankComponent[] = [];

  constructor(private evaluationService: EvaluationService) {}

  private load() {
    this.evaluationService.getFillBlanks(this.lessonsectionId).subscribe((data) => {
      this.fillBlanks = data.map((q) => ({
        ...q,
        selectedAnswer: null,
        answered: false,
      }));
    });
  }

  ngOnInit() {
    this.load();
  }

  resetFillBlank() {
    this.load();
  }

  submitAnswers() {
    let calculatedScore = 0;
    this.fillBlanks.forEach((eachFillBlanks) => {
      const isCorrect = eachFillBlanks.answer === eachFillBlanks.selectedAnswer;
      calculatedScore += +isCorrect; // Increment score if correct
      eachFillBlanks.answered = true;

      // Add feedback based on correctness
      eachFillBlanks.feedback = isCorrect
        ? "Great job! That's the correct answer."
        : `The correct answer was "${eachFillBlanks.options[eachFillBlanks.answer]}". Keep practicing!`;
    });

    // Emit the calculated score
    this.score.emit((calculatedScore / this.fillBlanks.length) * 100);
  }

  isAnyAnswerSelected(): boolean {
    return this.fillBlanks.some((question) => question.selectedAnswer !== null);
  }
}
