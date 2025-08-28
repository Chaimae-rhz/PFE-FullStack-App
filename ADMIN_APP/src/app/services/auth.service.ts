import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated: boolean = false;
  public roles: string[] = [];
  private usernameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public username$: Observable<string> = this.usernameSubject.asObservable();
  public currentAdminId: string = '';

  constructor(private router: Router, private http: HttpClient) {
    this.loadAuthState();
  }

  private loadAuthState() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      this.isAuthenticated = JSON.parse(isAuthenticated);
      this.currentAdminId = localStorage.getItem('currentAdminId') || '';
      this.roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.usernameSubject.next(localStorage.getItem('username') || '');
    }
  }

  private saveAuthState() {
    localStorage.setItem('isAuthenticated', JSON.stringify(this.isAuthenticated));
    localStorage.setItem('currentAdminId', this.currentAdminId);
    localStorage.setItem('roles', JSON.stringify(this.roles));
    localStorage.setItem('username', this.usernameSubject.getValue());
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post('http://172.30.70.16:8082/loginAdmin', { email, password }).pipe(
      tap((response: any) => {
        console.log('API Response:', response);

        this.isAuthenticated = true;
        this.currentAdminId = response.id;
        this.usernameSubject.next(response.email);
        this.roles = response.superAdmin ? ['SuperAdmin'] : [];
        this.saveAuthState();

        console.log('Assigned roles:', this.roles);
      })
    );
  }

  public handleLoginResponse(response: any): void {
    console.log('Handle Login Response:', response);

    this.isAuthenticated = true;
    this.usernameSubject.next(response.email);
    this.currentAdminId = response.id;
    this.roles = response.superAdmin ? ['SuperAdmin'] : [];
    this.saveAuthState();

    console.log('Handled roles:', this.roles);
  }

  public logout() {
    this.isAuthenticated = false;
    this.roles = [];
    this.usernameSubject.next('');
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public resetPassword(email: string): Observable<any> {
    return this.http.post('http://172.30.70.16:8082/resetPassword', { email });
  }

  public updateAdminProfile(adminData: any): Observable<any> {
    return this.http.put(`http://172.30.70.16:8082/updateProfile/${this.currentAdminId}`, adminData);
  }

  public getAdminProfile(): Observable<any> {
    return this.http.get(`http://172.30.70.16:8082/adminsById/${this.currentAdminId}`);
  }

  public resetPasswordConfirm(token: string, newPassword: string): Observable<any> {
    const request = { token, newPassword };
    return this.http.post<any>(`http://172.30.70.16:8082/resetPasswordConfirm`, request, { responseType: 'text' as 'json' });
  }

  public hasRole(role: string): boolean {
    const hasRole = this.roles.includes(role);
    console.log(`Checking role ${role}: ${hasRole}`);
    return hasRole;
  }
}
