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
  import { IContent } from './content.model';
  import { ContentService } from './content.service';
  import { MatTooltipModule } from '@angular/material/tooltip';

  
  @Component({
    selector: 'app-content',
    imports: [
      CommonModule,
      MatTableModule,
      MatCardModule,
      MatIconModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatTooltipModule,
    ],
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css'],
  })
  export class ContentComponent implements OnInit {
    subjectId = 0; 
    
    displayedColumns: string[] = ['Quiz', 'FillBlanks', 'TrueFalse', 'actions'];
    dataSource: IContent[] = [];
    isFormVisible = false;
    isEditMode = false;
    currentContentId: number | null = null;
    contentForm!: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private contentService: ContentService
    ) {}
  
    ngOnInit(): void {
      
          this.route.params.subscribe((params) => {
            this.subjectId = +params['subjectId']; 
            this.loadContents();
            this.initForm();
          });
        
    }
  
    loadContents(): void {
      this.contentService.getAll(this.subjectId).subscribe((data) => {
        this.dataSource = data;
      });
    }
  
    initForm(): void {
      this.contentForm = this.fb.group({
        Id: [null, []],
        Quiz: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10240)]],
      FillBlanks: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10240)]],
      TrueFalse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10240)]]
      });
    }
  
    toggleForm(): void {
      this.isFormVisible = !this.isFormVisible;
      this.isEditMode = false;
      this.contentForm.reset();
    }
  
    editContent(content: IContent): void {
      this.isFormVisible = true;
      this.isEditMode = true;
      this.currentContentId = content.Id ?? null;
      this.contentForm.patchValue(content);
    }
  
    deleteContent(contentId: number): void {
      this.contentService.delete(contentId).subscribe(() => {
        this.loadContents();
      });
    }
  
    

    onSubmit(): void {
      if (this.contentForm.valid) {
        const content = { ...this.contentForm.value, 
          subject: this.subjectId };

        if (this.isEditMode) {
          this.contentService.edit(content).subscribe(() => {
            this.loadContents();
            this.toggleForm();
          });
        } else {
          this.contentService.add(content).subscribe(() => {
            this.loadContents();
            this.toggleForm();
          });
        }
      }
    }
  
    getErrorMessages(controlName: string): string[] {
      const control = this.contentForm.get(controlName);
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