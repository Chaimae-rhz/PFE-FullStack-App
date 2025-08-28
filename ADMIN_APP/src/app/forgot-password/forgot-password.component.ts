import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  public forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForgotPasswordForm(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.authService.resetPassword(email).subscribe(
        (response: any) => {
          // Vérifiez le contenu de la réponse pour détecter les erreurs
          if (response && response.message) {
            // Si aucune erreur, affichez le message de succès et redirigez vers la page de connexion
            this._snackBar.open(response.message, 'Fermer', {
              duration: 5000,
            });
            this.router.navigate(['/login']);
          } else {
            console.error('Erreur lors de l\'envoi de la demande de réinitialisation de mot de passe :', response);

          }
        },
        (error: any) => {
          // Gestion des erreurs HTTP
          console.error('Erreur lors de l\'envoi de la demande de réinitialisation de mot de passe :', error);
          this._snackBar.open(" Adresse e-mail non trouvée.", 'Fermer', {
            duration: 5000,
          });
        }
      );
    }
  }

  getErrorMessage(fieldName: string, error: ValidationErrors): string {
    if (error['required']) {
      return `${fieldName} est requis`;
    } else if (error['email']) {
      return `Adresse email invalide`;
    } else {
      return "";
    }
  }

}

