import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true; // Toggle password visibility
  showVisibilityIcon: boolean = false; // Control visibility of the eye icon
  isLoading: boolean = false; // Track login state

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Handle password input event
  onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.showVisibilityIcon = input.value.length > 0; // Show icon if input is not empty
  }

  // Fill demo credentials for different roles (for demonstration purposes)
  fillDemoCredentials(role: string): void {
    this.errorMessage = ''; // Clear any previous error

    switch(role) {
      case 'admin':
        this.loginForm.setValue({ username: 'admin', password: 'admin' });
        break;
      case 'teacher':
        this.loginForm.setValue({ username: 'teacher', password: 'teacher' });
        break;
      case 'student':
        this.loginForm.setValue({ username: 'student', password: 'student' });
        break;
    }

    this.showVisibilityIcon = true;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    this.loginService.validate(username, password).subscribe({
      next: (userInfo) => {
        if (userInfo) {
          if (userInfo?.role == 'admin') {
            this.router.navigate(['admin']);
          } else if (userInfo?.role == 'principal') {
            this.router.navigate(['school-dashboard']);
          } else if (userInfo?.role == 'teacher') {
            this.loginService
              .getTeacherAdhaar(userInfo.adhaar)
              .subscribe((teacher) => {
                this.router.navigate([
                  'school-dashboard',
                  'school',
                  teacher.school
                ]);
              });
          } else if (userInfo?.role == 'student') {
            this.loginService
              .getByAdhaar(userInfo.adhaar)
              .subscribe((student) => {
                this.router.navigate([
                  'student-dashboard',
                  'school',
                  student.school,
                  'standard',
                  student.standard,
                  'student',
                  student.Id,
                ]);
              });
          }
        }
        else {
            this.errorMessage = 'Invalid username or password';
          }
          this.isLoading = false;
        },
      error: (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
