import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { IFillBlankComponent } from './fillblank.component.model';
import { VoiceService } from '../voice.service';
import { NavigationStart, Router } from '@angular/router';

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
    return data.filter((q: any) => q.answer < 0 || q.answer > 3).length === 0;
  }
  private load() {
    this.evaluationService.getFillBlanks(this.lessonsectionId).subscribe((data) => {
      if (!this.validate_data(data)) {
        console.error('Invalid fill in blanks data received:', data);
        return;
      }
      this.fillBlanks = data.map((q) => ({
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

  resetFillBlank() {
    this.load();
  }

  submitAnswers() {
    let calculatedScore = 0;
    this.fillBlanks.forEach((eachFillBlanks) => {
      const isCorrect = eachFillBlanks.answer === eachFillBlanks.selectedAnswer;
      calculatedScore += +isCorrect; // Increment score if correct
      eachFillBlanks.answered = true;

      eachFillBlanks.feedback = isCorrect
        ? "Great job! That's the correct answer."
        : `The correct answer was "${eachFillBlanks.options[eachFillBlanks.answer]}". Keep practicing!`;
    });

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

    const correctAnswer = currentQuestion.options[currentQuestion.answer];
    const options = currentQuestion.options.join(', ');

    // Construct a detailed context for the bot
    const contextPrompt = `
            You are an AI tutor assisting students with fill in the blanks questions with multiple options. Your role is to:
      - Explain the question in simple terms.
      - Provide the correct answer.
      - Explain WHY it is correct.
      - Compare the given options to clarify misunderstandings.

      **Question:** "${this.botQuestion}"
      **Options:** ${options}
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
    const q = this.fillBlanks[currentIndex];
    if (q == null) return '';
    let speech = `${currentIndex + 1}. ${q.question.replace(/_+/g, "---")}. `;
    q.options.forEach((opt: string, index: number) => {
      speech += `${index + 1}: ${opt}. `;
    });
    return speech;
  }

  readCurrentQuestion(currentIndex: number) {
    if (!this.fillBlanks) return;
    let text = this.formatQuestionForSpeech(currentIndex);
    if (text.trim() === '') return; // Don't attempt to speak if text is empty
    this.voiceService.speak(text);
  }

  submitAnswerVoice(currentIndex: number) {
    this.voiceService.stopSpeaking();
    this.voiceService.listen((heard) => {
      if (heard != null && heard.trim() !== '') {
        this.fillBlanks[currentIndex].user_answer = heard;
        this.processAnswer(this.currentVoiceSelectionIndex, heard);
      } else {
        // ignore empty/whitespace recognition results and keep previous state
        console.warn('Voice input was empty or whitespace.');
      }
    });
  }

  processAnswer(currentIndex: number, userAnswer: string) {
    const currentQ = this.fillBlanks[currentIndex];
    const answer = currentQ.options[currentQ.answer].toLowerCase();
    const spoken = userAnswer.toLowerCase();

    this.evaluationService.aiCompareText(spoken, answer).subscribe(response => {
      const isCorrect = response.match;
      currentQ.answered = true;
      currentQ.selectedAnswer = isCorrect ? currentQ.answer : null; // Mark as correct if it matches, otherwise keep it null
      let text = isCorrect
        ? `Correct. ${spoken}`
        : `That is incorrect. Correct answer is: ${answer}`;
      this.fillBlanks[currentIndex].feedback = text;
      this.cdr.detectChanges();
      this.readExplanation(currentIndex, text);
    })
  }

  readExplanation(currentIndex: number, text: string) {
    if (!this.fillBlanks) return;
    this.voiceService.speak(text, () => {
      if (currentIndex < this.fillBlanks.length) {
          this.currentVoiceSelectionIndex++;
          this.readCurrentQuestion(this.currentVoiceSelectionIndex);
          this.cdr.detectChanges();
      }
    });
    
  }

}
