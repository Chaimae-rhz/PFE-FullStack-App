import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import {UserDTO} from "./signup.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  username: string | undefined;
  failedAttempts: number = 0; // Ajout de la variable pour compter les échecs

  constructor(private router: Router, private http: HttpClient) {
    // Vérifiez l'état d'authentification au chargement de l'application
    this.checkLocalAuthState();
  }

  login(username: string) {
    this.isAuthenticated = true;
    this.username = username;
    // Stockez l'état d'authentification localement
    localStorage.setItem('authState', 'true');
    localStorage.setItem('username', username);
  }

  logout() {
    this.isAuthenticated = false;
    this.username = undefined;
    // Supprimez l'état d'authentification du stockage local
    localStorage.removeItem('authState');
    localStorage.removeItem('username');
    this.router.navigateByUrl('/login');
  }

  getCurrentUser(): string | undefined{
    // Envoyer une requête HTTP pour récupérer l'utilisateur courant
    return this.username;
  }
  checkLocalAuthState(): boolean {
    // Vérifiez si l'état d'authentification est présent dans le stockage local
    const authState = localStorage.getItem('authState');
    const storedUsername = localStorage.getItem('username');

    if (authState === 'true' && storedUsername) {
      this.isAuthenticated = true;
      this.username = storedUsername;
      return true;
    } else {
      return false;
    }
  }

}
