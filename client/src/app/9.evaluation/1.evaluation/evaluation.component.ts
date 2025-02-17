import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExplanationComponent } from '../2.explanation/explanation.component';
import { FillBlankComponent } from '../4.fillblank/fillblank.component';
import { QuizComponent } from '../3.quiz/quiz.component';
import { TrueFalseComponent } from '../5.truefalse/truefalse.component';

@Component({
  selector: 'app-evaluation',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatProgressBarModule,
    ExplanationComponent,
    FillBlankComponent,
    QuizComponent,
    TrueFalseComponent,
  ],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent {
  steps = ['Explanation', 'Quiz', 'TrueFalse', 'FillBlank'];
  currentStep = 0;
  progress = 0;

  quizScore = 0;
  trueFalseScore = 0;
  fillBlankScore = 0;

  nextStep() {
    if (this.progress == 100) {
      alert('This is done!');
    } else if (this.currentStep === 0) {
      this.currentStep++;
    } else if (this.currentStep === 1 && this.quizScore >= 90) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.trueFalseScore >= 90) {
      this.currentStep++;
    } else if (this.currentStep === 3 && this.fillBlankScore >= 90) {
      this.currentStep++;
    }

    this.updateProgress();
  }

  updateProgress() {
    this.progress = ((this.currentStep + 1) / this.steps.length) * 100;
  }

  updateScore(component: string, score: number) {
    if (component === 'Quiz') this.quizScore = score;
    if (component === 'TrueFalse') this.trueFalseScore = score;
    if (component === 'FillBlank') this.fillBlankScore = score;
  }
}
