import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailAdmin } from './EmailAdmin.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://172.30.70.16:8082';

  constructor(private http: HttpClient) { }

  getEmailAdmin(): Observable<EmailAdmin> {
    return this.http.get<EmailAdmin>(`${this.apiUrl}`);
  }


  updateEmailAdmin(newEmail: string, newPassword: string): Observable<any> {
    const body = { newEmail, newPassword };
    return this.http.put(`${this.apiUrl}/update-email-pass`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    });
  }
}
