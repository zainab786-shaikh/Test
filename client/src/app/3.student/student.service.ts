import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStudent } from './student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/v1';
  standardId: number = 0;
  data: IStudent[] = [];

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  constructor(private http: HttpClient) {}

  getAll(inStandardId: number): Observable<IStudent[]> {
    this.standardId = inStandardId;
    return this.http.get<IStudent[]>(
      `${this.apiUrl}/student/standard/${inStandardId}`,
      {
        headers: this.headers,
      }
    );
  }

  get(inStudentId: number): Observable<IStudent> {
    return this.http.get<IStudent>(`${this.apiUrl}/student/${inStudentId}`, {
      headers: this.headers,
    });
  }

  add(inStudent: IStudent): Observable<IStudent> {
    return this.http.post<IStudent>(`${this.apiUrl}/student`, inStudent, {
      headers: this.headers,
    });
  }

  edit(inStudent: IStudent): Observable<IStudent> {
    return this.http.put<IStudent>(
      `${this.apiUrl}/student/${inStudent.Id}`,
      inStudent,
      {
        headers: this.headers,
      }
    );
  }

  delete(inStudentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/student/${inStudentId}`, {
      headers: this.headers,
    });
  }
}
