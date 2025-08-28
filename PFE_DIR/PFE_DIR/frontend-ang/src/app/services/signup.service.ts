import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UserDTO } from './signup.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://172.30.70.16:8082';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  addUser(user: UserDTO): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/signupUsers`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error); // Renvoie l'erreur du backend
      })
    );
  }

  addUserAndLogin(user: UserDTO): Observable<any> {
    return this.addUser(user).pipe(
      tap(() => this.authService.login(user.username))
    );
  }

  verifyPersonne(ppr: number, dateNaissance: string): Observable<boolean> {
    const params = new HttpParams()
      .set('ppr', ppr.toString())
      .set('dateNaissance', dateNaissance);

    return this.httpClient.get<boolean>(`${this.apiUrl}/personneFSM/exists`, { params });
  }
}
