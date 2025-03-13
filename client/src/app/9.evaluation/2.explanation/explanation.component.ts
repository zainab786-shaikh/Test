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

  sendQuestion() {
    if (!this.userQuestion.trim()) return;

    // Add user question to messages
    this.messages.push({
      content: this.userQuestion,
      isUser: true,
    });

    const context = {
      explanation: this.explanation, // The raw explanation text
      question: this.userQuestion,
    };

    this.loading = true;
    this.evaluationService.submitChatQuestion(context).subscribe({
      next: (response) => {
        this.messages.push({
          content: response.answer,
          isUser: false,
        });
        this.userQuestion = '';
      },
      error: (error) => {
        this.messages.push({
          content: 'Sorry, there was an error processing your question.',
          isUser: false,
        });
      },
      complete: () => (this.loading = false),
    });
  }
}
