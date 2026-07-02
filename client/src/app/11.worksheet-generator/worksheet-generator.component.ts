import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

import { WorksheetService } from '../core/services/worksheet.service';
import { LessonService } from '../7.lesson/lesson.service';
import { SubjectService } from '../6.subject/subject.service';

interface QuestionCounts {
  MCQ: number;
  TRUE_FALSE: number;
  FILL_BLANK: number;
  SHORT_ANSWER: number;
  [key: string]: number;
}

@Component({
  selector: 'app-worksheet-generator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './worksheet-generator.component.html',
  styleUrls: ['./worksheet-generator.component.css'],
})
export class WorksheetGeneratorComponent implements OnInit {
  subjectId = 0;
  lessonId = 0;
  subjectName = '';
  lessonName = '';

  availableCounts: QuestionCounts = {
    MCQ: 0,
    TRUE_FALSE: 0,
    FILL_BLANK: 0,
    SHORT_ANSWER: 0,
  };

  worksheetForm!: FormGroup;
  isGenerating = false;
  generationSuccess = false;
  zipUrl = '';
  errorMessage = '';

  // Warning Modal States
  showWarningModal = false;
  warningData: {
    available: Partial<QuestionCounts>;
    required: Partial<QuestionCounts>;
  } | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private worksheetService: WorksheetService,
    private lessonService: LessonService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = +params['subjectId'];
      this.lessonId = +params['lessonId'];
      this.loadMetaDetails();
      this.loadAvailableQuestions();
    });

    this.initForm();
  }

  loadMetaDetails(): void {
    this.lessonService.get(this.lessonId).subscribe({
      next: (lesson) => {
        this.lessonName = lesson.name;
        this.worksheetForm.patchValue({
          title: `Worksheet on ${lesson.name}`,
        });
      },
    });

    this.subjectService.get(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectName = subject.name;
      },
    });
  }

  loadAvailableQuestions(): void {
    this.worksheetService.getAvailableQuestions(this.lessonId).subscribe({
      next: (counts: QuestionCounts) => {
        this.availableCounts = counts;
      },
      error: (err) => {
        console.error('Error loading available questions count:', err);
        this.errorMessage = err.error?.message || 'Failed to fetch question pool sizes from database.';
      }
    });
  }

  initForm(): void {
    this.worksheetForm = this.fb.group({
      title: ['Worksheet', [Validators.required, Validators.minLength(3)]],
      studentCount: [10, [Validators.required, Validators.min(1), Validators.max(500)]],
      totalMarks: [null],
      mcqQty: [0, [Validators.required, Validators.min(0)]],
      trueFalseQty: [0, [Validators.required, Validators.min(0)]],
      fillBlankQty: [0, [Validators.required, Validators.min(0)]],
      shortAnswerQty: [0, [Validators.required, Validators.min(0)]],
    });
  }

  getTotalQuestions(): number {
    const f = this.worksheetForm.value;
    return (
      (f.mcqQty || 0) +
      (f.trueFalseQty || 0) +
      (f.fillBlankQty || 0) +
      (f.shortAnswerQty || 0)
    );
  }

  goBack(): void {
    this.location.back();
  }

  adjustQty(controlName: string, amount: number): void {
    const control = this.worksheetForm.get(controlName);
    if (control) {
      let val = Number(control.value || 0) + amount;
      if (val < 0) val = 0;
      
      let maxVal = 999;
      if (controlName === 'mcqQty') maxVal = this.availableCounts.MCQ;
      else if (controlName === 'trueFalseQty') maxVal = this.availableCounts.TRUE_FALSE;
      else if (controlName === 'fillBlankQty') maxVal = this.availableCounts.FILL_BLANK;
      else if (controlName === 'shortAnswerQty') maxVal = this.availableCounts.SHORT_ANSWER;
      
      if (val > maxVal) val = maxVal;
      
      control.setValue(val);
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  onQtyInput(controlName: string, max: number): void {
    const control = this.worksheetForm.get(controlName);
    if (control) {
      let val = Number(control.value);
      if (isNaN(val) || val < 0) {
        val = 0;
      }
      if (val > max) {
        val = max;
      }
      control.setValue(val, { emitEvent: false });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  onSubmit(allowReuse: boolean = false): void {
    if (this.worksheetForm.invalid) {
      return;
    }

    const val = this.worksheetForm.value;

    if (val.totalMarks !== null && val.totalMarks !== undefined && val.totalMarks !== '' && Number(val.totalMarks) < 1) {
      this.errorMessage = 'Total Marks must be a positive number.';
      return;
    }

    // Client-side hard checks
    if (val.mcqQty > this.availableCounts.MCQ) {
      this.errorMessage = `Requested MCQ quantity exceeds available MCQs (${this.availableCounts.MCQ})`;
      return;
    }
    if (val.trueFalseQty > this.availableCounts.TRUE_FALSE) {
      this.errorMessage = `Requested True/False quantity exceeds available questions (${this.availableCounts.TRUE_FALSE})`;
      return;
    }
    if (val.fillBlankQty > this.availableCounts.FILL_BLANK) {
      this.errorMessage = `Requested Fill-in-the-blank quantity exceeds available questions (${this.availableCounts.FILL_BLANK})`;
      return;
    }
    if (val.shortAnswerQty > this.availableCounts.SHORT_ANSWER) {
      this.errorMessage = `Requested Short Answer quantity exceeds available questions (${this.availableCounts.SHORT_ANSWER})`;
      return;
    }

    this.errorMessage = '';
    this.isGenerating = true;

    const payload = {
      title: val.title,
      lessonId: this.lessonId,
      studentCount: val.studentCount,
      totalMarks: val.totalMarks,
      quantities: {
        MCQ: val.mcqQty,
        TRUE_FALSE: val.trueFalseQty,
        FILL_BLANK: val.fillBlankQty,
        SHORT_ANSWER: val.shortAnswerQty,
      },
      allowReuse: allowReuse,
    };

    this.worksheetService.createWorksheet(payload).subscribe({
      next: (res) => {
        this.isGenerating = false;
        if (res.warning) {
          this.showWarningModal = true;
          this.warningData = res.warning;
        } else {
          this.showWarningModal = false;
          this.generationSuccess = true;
          this.zipUrl = res.zipUrl;
        }
      },
      error: (err) => {
        this.isGenerating = false;
        this.errorMessage = err.error?.message || 'Failed to generate worksheets. Please try again.';
      },
    });
  }

  confirmReuse(): void {
    this.onSubmit(true);
  }

  cancelWarning(): void {
    this.showWarningModal = false;
    this.warningData = null;
  }

  downloadZip(): void {
    if (!this.zipUrl) return;
    
    this.worksheetService.downloadZip(this.zipUrl).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = this.zipUrl.substring(this.zipUrl.lastIndexOf('/') + 1);
        link.setAttribute('download', `Worksheet_${filename}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.errorMessage = 'Failed to download ZIP file. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.generationSuccess = false;
    this.zipUrl = '';
    this.errorMessage = '';
    this.initForm();
    this.loadMetaDetails();
  }
}
