import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { EvaluationService } from '../evaluation.service';
import {
  BrowserModule,
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-explanation',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css'],
})
export class ExplanationComponent {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Input() explanationText: SafeHtml = 'This is a default explanation.';

  explanation: string = '';
  lastResponse = 0;

  // Chat properties
  userQuestion = '';
  messages: { content: string; isUser: boolean }[] = [];
  loading = false;

  constructor(
    private sanitizer: DomSanitizer,
    private evaluationService: EvaluationService
  ) {}

  // Load the questions
  private load() {
    this.evaluationService
      .getLessonExplanation(this.lessonId)
      .subscribe((data) => {
        this.explanation = data;
        this.explanationText = this.sanitizer.bypassSecurityTrustHtml(
          this.explanation
        );
      });
  }

  ngOnInit() {
    this.load();
  }

  sendQuestion(): void {
    const question = this.userQuestion.trim();
    if (!question) return;

    // Add user message
    this.messages.push({ content: question, isUser: true });

    // Create empty message placeholder for response
    const serverMsg = { content: '', isUser: false };
    this.messages.push(serverMsg);

    this.loading = true;
    const prompt = this.explanation
      ? `${this.explanation}\n\n${question}`
      : question;

    this.evaluationService.submitChatQuestion(prompt).subscribe({
      next: (token: string) => {
        serverMsg.content += token; // Update UI with each token
      },
      error: (error) => {
        console.error('Chat error:', error);
        serverMsg.content = 'Error retrieving response. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.userQuestion = '';
        this.loading = false;
      },
    });
  }
}
