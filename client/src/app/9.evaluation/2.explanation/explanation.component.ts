import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-explanation',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Input() explanationText: string = 'This is a default explanation.';
}
