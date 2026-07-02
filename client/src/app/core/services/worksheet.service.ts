import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorksheetService {
  private apiUrl = 'http://localhost:3000/v1/worksheet';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      tenantid: 'tenanta',
      traceparent: '12345',
      Authorization: token ? `Bearer ${token}` : 'Bearer Token',
    });
  }

  getAvailableQuestions(lessonId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-questions/${lessonId}`, {
      headers: this.getHeaders(),
    });
  }

  createWorksheet(config: any): Observable<any> {
    return this.http.post(this.apiUrl, config, {
      headers: this.getHeaders(),
    });
  }

  downloadZip(url: string): Observable<Blob> {
    // Prefix URL with server origin if it is relative
    const fullUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`;
    return this.http.get(fullUrl, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}
