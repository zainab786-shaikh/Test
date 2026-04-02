import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ITrueFalseComponent } from './truefalse.component.model';
import { VoiceService } from '../voice.service';
import { NavigationStart, Router } from '@angular/router';

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
  currentVoiceSelectionIndex = 0;
  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private voiceService: VoiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.voiceService.stopSpeaking();
      }
    });
  }

  private validate_data (data: any){
    return data.filter((q: any) => q.answer !== true && q.answer !== false).length === 0;
  }
  private load() {
    this.evaluationService.getTrueFalse(this.lessonsectionId).subscribe((data) => {
      if (!this.validate_data(data)) {
        console.error('Invalid quiz data received:', data);
        return;
      }
      this.trueFalseQuestions = data.map((q) => ({
        ...q,
        selectedAnswer: null,
        answered: false,
        feedback: undefined,
        user_answer: undefined
      }));
    });
  }

  ngOnInit() {
    this.load();
  }

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

      eachTrueFalse.feedback = isCorrect
        ? "Great job! That's the correct answer."
        : `The correct answer was "${eachTrueFalse.answer ? 'True' : 'False'}". Keep practicing!`;
    });

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
       You are an AI tutor assisting students with true and false questions. Your role is to:
      - Explain the question in simple terms.
      - Provide the correct answer.
      - Explain WHY it is correct.
      - Compare the given true and false options to clarify misunderstandings.

      **Question:** "${this.botQuestion}"
      **Correct Answer:** "${correctAnswer}"

      Guidelines:
      1. First, explain what the question means.
      2. Then, reveal the correct answer.
      3. Finally, explain why the correct answer is correct by comparing it to other options.
      4. If the user asks an unrelated question, respond with: "You are asking outside the context."

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

  //=============================================| Voice Interaction
  isInteractiveMode = false;
  isInteractive(): boolean {
    return this.isInteractiveMode;
  }

  isControlEnabled(currentIndex: number): boolean {
    let isEnabled = true;
    if (this.isInteractiveMode) {
      isEnabled = (currentIndex === this.currentVoiceSelectionIndex)
    }
    return isEnabled;
  }

  toggleInteractiveMode() {
    this.isInteractiveMode = !this.isInteractiveMode;
    if (this.isInteractiveMode) {
      this.currentVoiceSelectionIndex = 0;
      this.readCurrentQuestion(this.currentVoiceSelectionIndex);
    } else {
      this.voiceService.stopSpeaking();
    }
  }
  formatQuestionForSpeech(currentIndex: number): string {
    const q = this.trueFalseQuestions[currentIndex];
    let speech = `${currentIndex + 1}. ${q.question}. `;
        speech += " options are True or False. ";
    return speech;
  }

  readCurrentQuestion(currentIndex: number) {
    if (!this.trueFalseQuestions) return;
    this.voiceService.speak(this.formatQuestionForSpeech(currentIndex));
  }

  submitAnswerVoice(currentIndex: number) {
    this.voiceService.stopSpeaking();
    this.voiceService.listen((heard) => {
      if (heard != null && heard.trim() !== '') {
        this.trueFalseQuestions[currentIndex].user_answer = heard;
        this.processAnswer(this.currentVoiceSelectionIndex, heard);
      } else {
        // ignore empty/whitespace recognition results and keep previous state
        console.warn('Voice input was empty or whitespace.');
      }
    });
  }

  processAnswer(currentIndex: number, userAnswer: string) {
    const currentQ = this.trueFalseQuestions[currentIndex];
    const answer = currentQ.answer.toString(); // "true" or "false"
    const spoken = userAnswer.toLowerCase();

    this.evaluationService.compareTextToEmbedding(spoken, answer).subscribe(response => {
      const isCorrect = response.match;
      currentQ.answered = true;
      currentQ.selectedAnswer = isCorrect ? currentQ.answer : null; // Mark as correct if it matches, otherwise keep it null
      let text = isCorrect
        ? `Correct. ${spoken}`
        : `That is incorrect. Correct answer is: ${this.trueFalseQuestions[currentIndex].answer}`;
      this.trueFalseQuestions[currentIndex].feedback = text;
      this.cdr.detectChanges();
      this.readExplanation(currentIndex, text);
    })
  }

  readExplanation(currentIndex: number, text: string) {
    if (!this.trueFalseQuestions) return;
    this.voiceService.speak(text, () => {
      if (currentIndex < this.trueFalseQuestions.length) {
          this.currentVoiceSelectionIndex++;
          this.readCurrentQuestion(this.currentVoiceSelectionIndex);
          this.cdr.detectChanges();
      }
    });
    
  }

}
