import { Injectable } from '@angular/core';
import { sha256 } from 'crypto-hash';
import { LoginDetailService } from '../0.logindetail/logindetail.service';
import { ILoginDetail } from '../0.logindetail/logindetail.model';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentService } from '../3.1.student/student.service';
import { IStudent } from '../3.1.student/student.model';
import { TeacherComponent } from '../3.2.teacher/teacher.component';
import { ITeacher } from '../3.2.teacher/teacher.model';
import { TeacherService } from '../3.2.teacher/teacher.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/v1';
  userInfo: ILoginDetail | null = null;
  constructor(
    private http: HttpClient,
    private teacherService: TeacherService,
    private studentService: StudentService
  ) {}

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  validate(inUsername: string, inPassword: string): Observable<ILoginDetail> {
    return this.http.post<ILoginDetail>(
      `${this.apiUrl}/logindetail/validate`,
      {
        name: inUsername,
        password: inPassword,
      },
      {
        headers: this.headers,
      }
    );
  }

  getByAdhaar(adhaar: string): Observable<IStudent> {
    return this.studentService.getByAdhaar(adhaar);
  }

  getTeacherAdhaar(adhaar: string): Observable<ITeacher> {
    return this.teacherService.getByAdhaar(adhaar);
  }
}
