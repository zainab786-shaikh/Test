import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EvaluationService } from '../evaluation.service';

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
export class ExplanationComponent implements OnInit {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Input() explanationText: SafeHtml = 'This is a default explanation.';

  explanation: string = '';
  activeSubscription: any;

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
    this.activeSubscription = this.evaluationService
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

    // Add user message and create response placeholder
    this.messages.push({ content: this.userQuestion, isUser: true });
    const botMsg = { content: '', isUser: false };
    this.messages.push(botMsg);

    // Start streaming
    this.loading = true;

    // Use the raw explanation string instead of SafeHtml
    const fullPrompt = this.explanation + '\n\n' + this.userQuestion;

    this.evaluationService.submitChatQuestion(fullPrompt).subscribe({
      next: (token) => (botMsg.content += token),
      error: () => {
        botMsg.content = 'Error retrieving response.';
        this.loading = false;
      },
      complete: () => {
        this.userQuestion = '';
        this.loading = false;
      },
    });
  }

  stopGeneration() {
    // Cancel the subscription
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
      this.evaluationService.stopGeneration();
      this.activeSubscription = null;
    }
    this.loading = false;
  }
}
