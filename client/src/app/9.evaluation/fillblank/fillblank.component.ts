import { Component, OnInit } from '@angular/core';
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
    MatSelectModule
  ],
  templateUrl: './fillblank.component.html',
  styleUrl: './fillblank.component.css',
})
export class FillBlankComponent implements OnInit {
  fillBlanks: IFillBlankComponent[] = [];

  constructor(private evaluationService: EvaluationService) {}

  private load() {
    this.evaluationService.getFillBlanks().subscribe((data) => {
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
    this.fillBlanks.forEach((question) => {
      question.answered = true;
    });
  }

  isAnyAnswerSelected(): boolean {
    return this.fillBlanks.some((question) => question.selectedAnswer !== null);
  }
}
