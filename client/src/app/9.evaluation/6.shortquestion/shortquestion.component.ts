import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EvaluationService } from '../evaluation.service';
import { IShortQuestion } from '../evaluation.service.model';

export interface IShortQuestionComponent extends IShortQuestion {
  userAnswer: string;
  answered: boolean;
  feedback?: string;
}

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

  questions: IShortQuestionComponent[] = [];
  
  constructor(
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.evaluationService.getShortQuestions(this.lessonsectionId).subscribe((data) => {
      this.questions = data.map(q => ({
        ...q,
        userAnswer: '',
        answered: false
      }));
    });
  }

  submitAnswers() {
    let totalCorrect = 0;
    this.questions.forEach((q) => {
      const isCorrect = q.userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) {
        totalCorrect++;
      }
      q.answered = true;
      q.feedback = isCorrect 
        ? "Excellent! Your answer is correct." 
        : `The correct answer is: "${q.answer}"`;
    });

    const finalScore = Math.round((totalCorrect / this.questions.length) * 100);
    this.score.emit(finalScore);
  }

  resetShortQuestion() {
    this.load();
  }

  isAnyAnswerEntered(): boolean {
    return this.questions.some(q => q.userAnswer.trim().length > 0);
  }

  // Add bot support for consistency
  showBot = false;
  botQuestion = '';
  botResponse = '';
  userQuery = '';
  isLoading = false;

  askBot(question: string) {
    this.botQuestion = question;
    this.showBot = true;
    this.getBotResponse(question);
  }

  closeBot() {
    this.showBot = false;
    this.botQuestion = '';
    this.botResponse = '';
  }

  sendBotQuery() {
    if (this.userQuery.trim()) {
      this.getBotResponse(this.userQuery);
      this.userQuery = '';
    }
  }

  getBotResponse(query: string) {
    this.isLoading = true;
    this.botResponse = '';

    const currentQ = this.questions.find(q => q.question === this.botQuestion);
    if (!currentQ) {
      this.botResponse = "Error: Question not found.";
      this.isLoading = false;
      return;
    }

    const contextPrompt = `
      You are a strict AI tutor. Only answer user questions related to the given Short Answer question.
      **Question:** "${currentQ.question}"
      **Correct Answer:** "${currentQ.answer}"

      - Explain the concept if the user is stuck.
      - Do not just give the answer if they haven't tried.
      - Stay within the context.

      **User's Query:** "${query}"
    `;

    this.evaluationService.generateResponse(contextPrompt).subscribe({
      next: (response) => {
        this.botResponse += response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bot response:', error);
        this.isLoading = false;
      }
    });
  }
}
