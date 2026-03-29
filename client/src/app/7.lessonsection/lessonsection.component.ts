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
import { Router, ActivatedRoute } from '@angular/router';
import { ILessonSection } from './lessonsection.model';
import { LessonSectionService } from './lessonsection.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lesson-section',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lessonsection.component.html',
  styleUrls: ['./lessonsection.component.css'],
})
export class LessonSectionComponent implements OnInit {
  subjectId = 1;
  lessonId = 1;

  displayedColumns: string[] = [
    'Name',
    'Explanation',
    'Quiz',
    'FillBlanks',
    'TrueFalse',
    'ShortQuestion',
    'actions',
  ];

  dataSource: ILessonSection[] = [];
  isFormVisible = false;
  isEditMode = false;
  currentLessonSectionId: number | null = null;
  lessonSectionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lessonSectionService: LessonSectionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subjectId = +params['subjectId'];
      this.lessonId = +params['lessonId'];
      this.loadLessonSections();
      this.initForm();
    });
  }

  loadLessonSections(): void {
    this.lessonSectionService
      .getAll(this.subjectId, this.lessonId)
      .subscribe((data) => {
        this.dataSource = data;
      });
  }

  loadSingleLessonSection(
    lessonSectionId: number
  ): Observable<ILessonSection> {
    return this.lessonSectionService.get(lessonSectionId);
  }

  initForm(): void {
    this.lessonSectionForm = this.fb.group({
      Id: [null],

      name: ['', [Validators.required, Validators.minLength(3)]],

      lessoninfo: this.fb.group({
        id: [0],
        explanation: ['', [Validators.required]],
        summary: ['', [Validators.required]],
        examples: ['', [Validators.required]],
      }),

      quiz: ['', [Validators.required]],
      fillblanks: ['', [Validators.required]],
      truefalse: ['', [Validators.required]],
      shortquestion: ['', [Validators.required]],
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.isEditMode = false;
    this.lessonSectionForm.reset();
  }

  editLessonSection(lesson: ILessonSection): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentLessonSectionId = lesson.Id ?? null;

    if (this.currentLessonSectionId) {
      this.loadSingleLessonSection(this.currentLessonSectionId).subscribe(
        (lessonSectionData) => {
          this.lessonSectionForm.patchValue({
            ...lessonSectionData,
            lessoninfo: lessonSectionData.lessoninfo,
            quiz: JSON.stringify(lessonSectionData.quiz, null, 2),
            fillblanks: JSON.stringify(
              lessonSectionData.fillblanks,
              null,
              2
            ),
            truefalse: JSON.stringify(
              lessonSectionData.truefalse,
              null,
              2
            ),
            shortquestion: JSON.stringify(
              lessonSectionData.shortquestion,
              null,
              2
            ),
          });
        }
      );
    }
  }

  deleteLessonSection(lessonSectionId: number): void {
    this.lessonSectionService.delete(lessonSectionId).subscribe(() => {
      this.loadLessonSections();
    });
  }

  onSubmit(): void {
    if (this.lessonSectionForm.valid) {
      const formValue = this.lessonSectionForm.value;

      const lesson = {
        ...formValue,
        quiz: JSON.parse(formValue.quiz),
        fillblanks: JSON.parse(formValue.fillblanks),
        truefalse: JSON.parse(formValue.truefalse),
        shortquestion: JSON.parse(formValue.shortquestion),
        subject: this.subjectId,
        lesson: this.lessonId,
      };

      if (this.isEditMode) {
        this.lessonSectionService.edit(lesson).subscribe(() => {
          this.loadLessonSections();
          this.toggleForm();
        });
      } else {
        this.lessonSectionService.add(lesson).subscribe(() => {
          this.loadLessonSections();
          this.toggleForm();
        });
      }
    }
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.lessonSectionForm.get(controlName);
    if (control?.touched && control?.invalid) {
      const errors: { [key: string]: string } = {
        required: 'This field is required.',
        minlength: 'Too short.',
        maxlength: 'Too long.',
      };
      return Object.keys(control.errors || {}).map((key) => errors[key]);
    }
    return [];
  }
}