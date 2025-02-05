import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IProgress } from './progress.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl = 'http://localhost:3000/v1';
  subjectId: number = 0;
  studentId: number = 0;
  standardId: number = 0;
  schoolId: number = 0;
  data: IProgress[] = [];

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  constructor(private http: HttpClient) {}

  getAll(
    inSubjectId: number,
    inStudentId: number,
    inStandardId: number,
    inSchoolId: number
  ): Observable<IProgress[]> {
    this.subjectId = inSubjectId;
    this.studentId = inStudentId;
    this.standardId = inStandardId;
    this.schoolId = inSchoolId;
    return this.http.get<IProgress[]>(
      `${this.apiUrl}/progress/subject/${inSubjectId}/student/${inStudentId}/standard/${inStandardId}/school/${inSchoolId}`,
      {
        headers: this.headers,
      }
    );
  }

  get(inProgressId: number): Observable<IProgress> {
    return this.http.get<IProgress>(`${this.apiUrl}/progress/${inProgressId}`, {
      headers: this.headers,
    });
  }

  add(inProgress: IProgress): Observable<IProgress> {
    return this.http.post<IProgress>(`${this.apiUrl}/progress`, inProgress, {
      headers: this.headers,
    });
  }

  edit(inProgress: IProgress): Observable<IProgress> {
    return this.http.put<IProgress>(
      `${this.apiUrl}/progress/${inProgress.Id}`,
      inProgress,
      {
        headers: this.headers,
      }
    );
  }

  delete(inProgressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/progress/${inProgressId}`, {
      headers: this.headers,
    });
  }
}
