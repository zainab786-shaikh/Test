import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EvaluationService } from '../evaluation.service';
import { IShortQuestion } from '../evaluation.service.model';

@Component({
  selector: 'app-shortquestion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './shortquestion.component.html',
  styleUrls: ['./shortquestion.component.css'],
})
export class ShortQuestionComponent implements OnInit {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Output() score = new EventEmitter<number>();

  questions: IShortQuestion[] = [];
  currentIndex = 0;
  userAnswer = '';
  isAnswered = false;
  feedback = '';
  isCorrect = false;

  constructor(
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {
    this.evaluationService.getShortQuestions(this.lessonsectionId).subscribe((data) => {
      this.questions = data;
    });
  }

  submitAnswer() {
    if (this.currentIndex >= this.questions.length) return;

    const currentQ = this.questions[this.currentIndex];
    // Simple case-insensitive match for basic verification without SimilarityService
    this.isCorrect = this.userAnswer.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    
    this.isAnswered = true;
    this.feedback = this.isCorrect 
      ? "Excellent! Your answer is correct." 
      : `The correct answer is: "${currentQ.answer}"`;

    const resultScore = this.isCorrect ? 100 : 0;
    this.score.emit(resultScore); 
  }

  nextQuestion() {
    this.currentIndex++;
    this.userAnswer = '';
    this.isAnswered = false;
    this.feedback = '';
  }

}
