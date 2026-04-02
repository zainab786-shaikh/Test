import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EvaluationService } from '../evaluation.service';
import { IShortQuestion } from '../evaluation.service.model';
import { VoiceService } from '../voice.service';
import { NavigationStart, Router } from '@angular/router';
import { IShortQuestionComponent } from './shortquestion.component.model';

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

  short_questions: IShortQuestionComponent[] = [];
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

  ngOnInit() {
    this.load();
  }

  private load() {
    this.evaluationService.getShortQuestions(this.lessonsectionId).subscribe((data) => {
      this.short_questions = data.map(q => ({
        ...q,
        answered: false,
        feedback: undefined,
        user_answer: undefined
      }));
    });
  }

  submitAnswers() {
    let totalCorrect = 0;
    this.short_questions.forEach((q) => {
      const isCorrect = q.user_answer?.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) {
        totalCorrect++;
      }
      q.answered = true;
      q.feedback = isCorrect 
        ? `Excellent! Your answer "${q.user_answer}" is correct.` 
        : `The correct answer is: "${q.answer}"`;
    });

    const finalScore = Math.round((totalCorrect / this.short_questions.length) * 100);
    this.score.emit(finalScore);
  }

  resetShortQuestion() {
    this.load();
  }

  isAnyAnswerEntered(): boolean {
    return this.short_questions.some(q => q.user_answer && q.user_answer.trim().length > 0);
  }

  // Add bot support for consistency
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

    const currentQuestion = this.short_questions.find(q => q.question === this.botQuestion);
    if (!currentQuestion) {
      this.botResponse = "Error: Question not found.";
      this.isLoading = false;
      return;
    }

    const correctAnswer = currentQuestion.answer
    const contextPrompt = `
      You are an AI tutor assisting students with short answer questions. Your role is to:
      - Explain the question in simple terms.
      - Provide the correct answer.
      - Explain WHY it is correct.


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
    const q = this.short_questions[currentIndex];
    let speech = `${currentIndex + 1}. ${q.question}. `;
    return speech;
  }

  readCurrentQuestion(currentIndex: number) {
    if (!this.short_questions) return;
    this.voiceService.speak(this.formatQuestionForSpeech(currentIndex));
  }

  submitAnswerVoice(currentIndex: number) {
    this.voiceService.stopSpeaking();
    this.voiceService.listen((heard) => {
      if (heard != null && heard.trim() !== '') {
        this.short_questions[currentIndex].user_answer = heard;
        this.processAnswer(this.currentVoiceSelectionIndex, heard);
      } else {
        // ignore empty/whitespace recognition results and keep previous state
        console.warn('Voice input was empty or whitespace.');
      }
    });
  }

  processAnswer(currentIndex: number, user_answer: string) {
    const currentQ = this.short_questions[currentIndex];
    const answer = currentQ.answer.toLowerCase();
    const spoken = user_answer.toLowerCase();

    this.evaluationService.compareTextToEmbedding(spoken, answer).subscribe(response => {
      const isCorrect = response.match;
      currentQ.answered = true;
      let text = isCorrect
        ? `Correct. ${spoken}`
        : `That is incorrect. Correct answer is: ${this.short_questions[currentIndex].answer}`;
      this.short_questions[currentIndex].feedback = text;
      this.cdr.detectChanges();
      this.readExplanation(currentIndex, text);
    })
  }

  readExplanation(currentIndex: number, text: string) {
    if (!this.short_questions) return;
    this.voiceService.speak(text, () => {
      if (currentIndex < this.short_questions.length) {
          this.currentVoiceSelectionIndex++;
          this.readCurrentQuestion(this.currentVoiceSelectionIndex);
          this.cdr.detectChanges();
      }
    });
    
  }
}
