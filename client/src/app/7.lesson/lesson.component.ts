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
import { ILesson } from './lesson.model';
import { LessonService } from './lesson.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lesson',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
})
export class LessonComponent implements OnInit {
  subjectId = 0;

  displayedColumns: string[] = [
    'Name',
    'Explanation',
    'Quiz',
    'FillBlanks',
    'TrueFalse',
    'actions',
  ];
  dataSource: ILesson[] = [];
  isFormVisible = false;
  isEditMode = false;
  currentLessonId: number | null = null;
  lessonForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = +params['subjectId'];
      this.loadLessons();
      this.initForm();
    });
  }

  loadLessons(): void {
    this.lessonService.getAll(this.subjectId).subscribe((data) => {
      this.dataSource = data;
    });
  }
  loadSingleLessons(lessonId: number): Observable<ILesson> {
    return this.lessonService.get(lessonId);
  }

  initForm(): void {
    this.lessonForm = this.fb.group({
      Id: [null, []],
      Name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(2048),
        ],
      ],
      Explanation: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(102400),
        ],
      ],
      Quiz: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(102400),
        ],
      ],
      FillBlanks: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(102400),
        ],
      ],
      TrueFalse: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(102400),
        ],
      ],
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.isEditMode = false;
    this.lessonForm.reset();
  }

  editLesson(lesson: ILesson): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentLessonId = lesson.Id ?? null;
    if (this.currentLessonId) {
      this.loadSingleLessons(this.currentLessonId).subscribe((lessonData) => {
        this.lessonForm.patchValue(lessonData);
      });
    }
  }

  deleteLesson(lessonId: number): void {
    this.lessonService.delete(lessonId).subscribe(() => {
      this.loadLessons();
    });
  }

  onSubmit(): void {
    if (this.lessonForm.valid) {
      const lesson = { ...this.lessonForm.value, subject: this.subjectId };

      if (this.isEditMode) {
        this.lessonService.edit(lesson).subscribe(() => {
          this.loadLessons();
          this.toggleForm();
        });
      } else {
        this.lessonService.add(lesson).subscribe(() => {
          this.loadLessons();
          this.toggleForm();
        });
      }
    }
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.lessonForm.get(controlName);
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
