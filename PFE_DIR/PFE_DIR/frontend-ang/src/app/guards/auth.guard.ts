// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isAuthenticated || this.authService.checkLocalAuthState()) {
      return true;
    } else {
      const startTime = localStorage.getItem('countdown_start');
      if (startTime) {
        const elapsedSeconds = Math.floor((new Date().getTime() - parseInt(startTime, 10)) / 1000);
        if (elapsedSeconds < 30) {
          return false; // Bloquer l'accès à la page si le compte à rebours est en cours
        } else {
          localStorage.removeItem('countdown_start'); // Supprimer l'heure de début du compte à rebours expiré
          return true; // Autoriser l'accès à la page après l'expiration du compte à rebours
        }
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    }
  }
}
