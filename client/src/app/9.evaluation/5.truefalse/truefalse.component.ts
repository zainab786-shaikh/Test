import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Output() score = new EventEmitter<number>(); // Ensure this emits a number

  trueFalseQuestions: ITrueFalseComponent[] = [];

  constructor(private evaluationService: EvaluationService) {}

  // Load the questions
  private load() {
    this.evaluationService.getTrueFalse(this.lessonsectionId).subscribe((data) => {
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

  // // Handle Submit
  // submitAnswers() {
  //   let calculatedScore = 0;
  //   this.trueFalseQuestions.forEach((eachTrueFalse) => {
  //     calculatedScore += +(
  //       eachTrueFalse.answer == eachTrueFalse.selectedAnswer
  //     );
  //     eachTrueFalse.answered = true;
  //   });
  //   this.score.emit((calculatedScore / this.trueFalseQuestions.length) * 100);
  // }

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
  submitAnswers() {
    let calculatedScore = 0;
    this.trueFalseQuestions.forEach((eachTrueFalse) => {
      const isCorrect = eachTrueFalse.answer === eachTrueFalse.selectedAnswer;
      calculatedScore += +isCorrect; // Increment score if correct
      eachTrueFalse.answered = true;

      // Add feedback based on correctness
      eachTrueFalse.feedback = isCorrect
        ? "Great job! That's the correct answer."
        : `The correct answer was "${eachTrueFalse.answer ? 'True' : 'False'}". Keep practicing!`;
    });

    // Emit the calculated score
    this.score.emit((calculatedScore / this.trueFalseQuestions.length) * 100);
  }

  isAnyQuizAttempted(): boolean {
    return this.trueFalseQuestions.some((trueFalse) => trueFalse.selectedAnswer !== null);
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

  // Fetch bot response for MCQs and True/False questions
  getBotResponse(query: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.botResponse = ''; // Clear previous response

    // Find the current True/False question
    const currentQuestion = this.trueFalseQuestions.find(q => q.question === this.botQuestion);

    if (!currentQuestion) {
      this.botResponse = "Error: Question not found.";
      this.isLoading = false;
      return;
    }

    const correctAnswer = currentQuestion.answer ? "True" : "False";

    // Construct a strict bot context for True/False questions
    const contextPrompt = `
      You are a strict AI tutor. Only answer user questions related to the given True/False question.

      **Question:** "${this.botQuestion}"
      **Correct Answer:** "${correctAnswer}"

      - If the user asks about the question, explain it clearly.
      - If the user asks about the correct answer, explain why it is correct.
      - If the user asks why the incorrect option is wrong, clarify with reasoning.
      - If the user asks something unrelated, respond with: "You are asking outside the context."

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
