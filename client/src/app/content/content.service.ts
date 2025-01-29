import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IContent } from './content.model';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiUrl = 'http://localhost:3000/v1';
  subjectId: number = 0;
  data: IContent[] = [];

  // Define the headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    tenantid: 'tenanta',
    traceparent: '12345',
    Authorization: 'Bearer Token', // Replace "Token" with your actual token
  });

  constructor(private http: HttpClient) {}

  getAll(inSubjectId: number): Observable<IContent[]> {
    this.subjectId = inSubjectId;
    return this.http.get<IContent[]>(
      `${this.apiUrl}/content/subject/${inSubjectId}`,
      {
        headers: this.headers,
      }
    );
  }

  get(inContentId: number): Observable<IContent> {
    return this.http.get<IContent>(`${this.apiUrl}/content/${inContentId}`, {
      headers: this.headers,
    });
  }

  add(inContent: IContent): Observable<IContent> {
    return this.http.post<IContent>(`${this.apiUrl}/content`, inContent, {
      headers: this.headers,
    });
  }

  edit(inContent: IContent): Observable<IContent> {
    return this.http.put<IContent>(
      `${this.apiUrl}/content/${inContent.Id}`,
      inContent,
      {
        headers: this.headers,
      }
    );
  }

  delete(inContentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/content/${inContentId}`, {
      headers: this.headers,
    });
  }
}
