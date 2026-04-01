import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStandardSubject } from './standardsubject.model';

@Injectable({
  providedIn: 'root',
})
export class StandardSubjectService {
  private apiUrl = 'http://localhost:3000/v1';
  standardId: number = 0;
  subjectId: number = 0;
  data: IStandardSubject[] = [];

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  constructor(private http: HttpClient) {}

  getAll(inStandardId: number): Observable<IStandardSubject[]> {
    this.standardId = inStandardId;
    return this.http.get<IStandardSubject[]>(
      `${this.apiUrl}/standardsubject/standard/${inStandardId}`,
      {
        headers: this.headers,
      }
    );
  }

  get(inStandardSubjectId: number): Observable<IStandardSubject> {
    return this.http.get<IStandardSubject>(
      `${this.apiUrl}/standardsubject/${inStandardSubjectId}`,
      {
        headers: this.headers,
      }
    );
  }

  add(inStandardSubject: IStandardSubject): Observable<IStandardSubject> {
    return this.http.post<IStandardSubject>(
      `${this.apiUrl}/standardsubject`,
      inStandardSubject,
      {
        headers: this.headers,
      }
    );
  }

  delete(inStandardSubjectId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/standardsubject/${inStandardSubjectId}`,
      {
        headers: this.headers,
      }
    );
  }
}
