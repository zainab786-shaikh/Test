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


  showBot = false;
  botQuestion = '';
  botResponse = '';
  userQuery = '';
  isLoading = false;
  errorMessage = '';

  // Show bot when "Ask Bot" is clicked
  askBot(question: string) {
    this.botQuestion = question;
    this.showBot = true;
    this.getBotResponse(question);
  }

  // Close bot
  closeBot() {
    this.showBot = false;
    this.botQuestion = '';
    this.botResponse = '';
  }

  // Handle user follow-up questions
  sendBotQuery() {
    if (this.userQuery.trim()) {
      this.getBotResponse(this.userQuery);
      this.userQuery = '';
    }
  }

  getBotResponse(query: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.botResponse = ''; // Clear previous response

    // Find the fill-in-the-blank question matching the botQuestion
    const currentQuestion = this.fillBlanks.find(q => q.question === this.botQuestion);

    if (!currentQuestion) {
      this.botResponse = "Error: Question not found.";
      this.isLoading = false;
      return;
    }

    const correctAnswer = currentQuestion.answer;
    const options = currentQuestion.options.join(', ');

    // Construct a detailed context for the bot
    const contextPrompt = `
      You are a helpful AI tutor. You will only answer user questions related to the given fill-in-the-blank question and its options.

      **Question:** "${this.botQuestion}"
      **Correct Answer:** "${correctAnswer}"
      **Options:** ${options}

      - If the user asks about the question, explain it clearly.
      - If the user asks about the correct answer, explain why it is correct.
      - If the user asks about an option, explain how it relates to the question.
      - If the user asks something completely unrelated, respond with: "You are asking outside the context."

      **User's Query:** "${query}"
    `;

    this.evaluationService.generateResponse(contextPrompt).subscribe({
      next: (response) => {
        this.botResponse += response; // Append new streaming response
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching bot response:', error);
        this.errorMessage = 'Error getting response. Try again!';
        this.isLoading = false;
      }
    });
  }


  stopBotResponse() {
    this.botResponse = "Chat stopped.";
  }
}
