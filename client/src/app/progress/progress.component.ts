import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IProgress } from './progress.model';
import { ProgressService } from './progress.service';

@Component({
  selector: 'app-progress',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  subjectId = 1;
  studentId = 0;
  standardId = 1;
  schoolId = 1;

  displayedColumns: string[] = [
    'QuizPercentage',
    'FillBlanksPercentage',
    'TrueFalsePercentage',
    'actions',
  ];
  dataSource: IProgress[] = [];
  isFormVisible = false;
  isEditMode = false;
  currentProgressId: number | null = null;
  progressForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      //this.subjectId = +params['subjectId'];
      this.studentId = +params['studentId'];
      //this.standardId = +params['standardId'];
      //this.schoolId = +params['schoolId'];
      this.loadProgresss();
      this.initForm();
    });
  }

  loadProgresss(): void {
    this.progressService
      .getAll(this.subjectId, this.studentId, this.standardId, this.schoolId)
      .subscribe((data) => {
        this.dataSource = data;
      });
  }

  initForm(): void {
    this.progressForm = this.fb.group({
      Id: [null, []],
      QuizPercentage: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      FillBlanksPercentage: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      TrueFalsePercentage: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.isEditMode = false;
    this.progressForm.reset();
  }

  editProgress(progress: IProgress): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentProgressId = progress.Id ?? null;
    this.progressForm.patchValue(progress);
  }

  deleteProgress(progressId: number): void {
    this.progressService.delete(progressId).subscribe(() => {
      this.loadProgresss();
    });
  }

  onSubmit(): void {
    if (this.progressForm.valid) {
      const progress = {
        QuizPercentage: Number(this.progressForm.get('QuizPercentage')?.value),
        FillBlanksPercentage: Number(
          this.progressForm.get('FillBlanksPercentage')?.value
        ),
        TrueFalsePercentage: Number(
          this.progressForm.get('TrueFalsePercentage')?.value
        ),
        subject: this.subjectId,
        student: this.studentId,
        standard: this.standardId,
        school: this.schoolId,
      };

      if (this.isEditMode) {
        this.progressService.edit(progress).subscribe(() => {
          this.loadProgresss();
          this.toggleForm();
        });
      } else {
        this.progressService.add(progress).subscribe(() => {
          this.loadProgresss();
          this.toggleForm();
        });
      }
    }
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.progressForm.get(controlName);
    if (control?.touched && control?.invalid) {
      const errors: { [key: string]: string } = {
        required: 'This field is required.',
        minlength: 'Too short.',
        maxlength: 'Too long.',
        pattern: 'Invalid format.',
      };
      return Object.keys(control.errors || {}).map((key) => errors[key]);
    }
    return [];
  }
}
