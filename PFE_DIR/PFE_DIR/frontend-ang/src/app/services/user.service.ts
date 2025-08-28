import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';  // Assurez-vous de définir ce modèle

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://172.30.70.16:8082';

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/info/${username}`);
  }

  updateUserByUsername(username: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${username}`, user);
  }
  checkEmailExists(email: string, username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/email-exists?email=${email}&username=${username}`);
  }
}
