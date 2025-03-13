import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EvaluationService } from '../evaluation.service';
import {
  BrowserModule,
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';

@Component({
  selector: 'app-explanation',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Input() explanationText: SafeHtml = 'This is a default explanation.';

  explanation: string = '';

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
}
