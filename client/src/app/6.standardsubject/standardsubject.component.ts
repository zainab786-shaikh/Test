import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { IStandardSubject } from './standardsubject.model';
import { StandardSubjectService } from './standardsubject.service';
import { SubjectService } from '../6.subject/subject.service';
import { ISubject } from '../6.subject/subject.model';

@Component({
  selector: 'app-standardsubject',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './standardsubject.component.html',
  styleUrls: ['./standardsubject.component.css'],
})
export class StandardSubjectComponent implements OnInit {
  standardId = 0;
  subject = 0;
  subjectList: ISubject[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource: IStandardSubject[] = [];
  isFormVisible = false;
  //isEditMode = false;
  currentStandardSubjectId: number | null = null;
  standardsubjectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private standardsubjectService: StandardSubjectService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.standardId = +params['standardId'];
      this.loadStandardSubjects();
      this.initForm();
    });
  }

  loadStandardSubjects(): void {
    forkJoin({
      subjectList: this.subjectService.getAll(),
      dataSource: this.standardsubjectService.getAll(this.standardId),
    }).subscribe(({ subjectList, dataSource }) => {
      this.subjectList = subjectList;
      this.dataSource = dataSource;

      this.dataSource = dataSource.map((item) => {
        const subject = this.subjectList.find(
          (eachSubject) => eachSubject.Id === item.subject
        );
        return {
          ...item,
          name: subject ? subject.name : '', // Retain existing name if no match found
        };
      });
    });
  }

  initForm(): void {
    this.standardsubjectForm = this.fb.group({
      Id: [null, []],
      subject: [null, []], // Add this line for subject selection
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    //this.isEditMode = false;
    this.standardsubjectForm.reset();
  }

  // editStandardSubject(standardsubjectId: IStandardSubject): void {
  //   this.isFormVisible = true;
  //   this.isEditMode = true;
  //   this.currentStandardSubjectId = standardsubjectId.Id ?? null;
  //   this.standardsubjectForm.patchValue(standardsubjectId);
  // }

  deleteStandardSubject(standardsubjectId: number): void {
    this.standardsubjectService.delete(standardsubjectId).subscribe(() => {
      this.loadStandardSubjects();
    });
  }

  onSubmit(): void {
    if (this.standardsubjectForm.valid) {
      const standardsubject = {
        ...this.standardsubjectForm.value,
        standard: this.standardId,
      };

      this.standardsubjectService.add(standardsubject).subscribe(() => {
        this.loadStandardSubjects();
        this.toggleForm();
      });
    }
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.standardsubjectForm.get(controlName);
    if (control?.touched && control?.invalid) {
      const errors: { [key: string]: string } = {
        required: 'This field is required.',
        minlength: 'Too short.',
        maxlength: 'Too long.',
        pattern: 'Invalid format.',
      };

      // Handle specific error messages for the 'subject' control
      if (
        controlName === 'subject' &&
        control.errors &&
        control.errors['required']
      ) {
        return ['Subject selection is required.'];
      }

      return Object.keys(control.errors || {}).map((key) => errors[key]);
    }
    return [];
  }
}
