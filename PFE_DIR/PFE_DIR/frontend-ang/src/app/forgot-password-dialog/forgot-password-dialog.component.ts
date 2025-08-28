import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css']
})
export class ForgotPasswordDialogComponent implements OnInit {
  email: string = '';
  resetCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  codeSent: boolean = false;
  codeVerified: boolean = false;
  disableSendButton: boolean = false;
  disableVerifyButton: boolean = false;
  hidePassword: boolean = true;
  incorrectAttempts: number = 0;
  readonly MAX_ATTEMPTS: number = 3;
  readonly COOLDOWN_PERIOD: number = 10000; // 10 seconds

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadState();
  }

  sendResetCode() {
    this.disableSendButton = true;
    const now = Date.now();
    localStorage.setItem('lastSendAttempt', now.toString());
    this.http.post('http://172.30.70.16:8082/forgot-password', { email: this.email }, { responseType: 'text' }).subscribe(response => {
      this.codeSent = true;
      this.snackBar.open('Code de réinitialisation envoyé à votre email', 'Fermer', {
        duration: 3000,
      });
      this.startSendButtonCooldown();
    }, error => {
      this.disableSendButton = false;
      this.snackBar.open('Email non trouvé', 'Fermer', {
        duration: 3000,
      });
    });
  }

  startSendButtonCooldown() {
    setTimeout(() => {
      this.disableSendButton = false;
    }, this.COOLDOWN_PERIOD);
  }

  verifyResetCode() {
    this.http.post('http://172.30.70.16:8082/verify-reset-code', { email: this.email, code: this.resetCode }, { responseType: 'text' }).subscribe(response => {
      this.codeVerified = true;
      this.snackBar.open('Code de réinitialisation vérifié', 'Fermer', {
        duration: 3000,
      });
    }, error => {
      this.incorrectAttempts++;
      if (this.incorrectAttempts >= this.MAX_ATTEMPTS) {
        this.disableVerifyButton = true;
        this.snackBar.open('Trop de tentatives incorrectes. Veuillez patienter 10 secondes.', 'Fermer', {
          duration: 3000,
        });
        setTimeout(() => {
          this.disableVerifyButton = false;
          this.incorrectAttempts = 0;
          this.saveState();
        }, this.COOLDOWN_PERIOD);
      }
      this.snackBar.open('Code de réinitialisation invalide', 'Fermer', {
        duration: 3000,
      });
      this.saveState();
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Les mots de passe ne correspondent pas', 'Fermer', {
        duration: 3000,
      });
      return;
    }
    this.http.post(`http://172.30.70.16:8082/reset-password?newPassword=${this.newPassword}`, this.email, { responseType: 'text' }).subscribe(response => {
      this.snackBar.open('Mot de passe réinitialisé avec succès', 'Fermer', {
        duration: 3000,
      });
      this.dialogRef.close();
    }, error => {
      this.snackBar.open('Erreur lors de la réinitialisation du mot de passe', 'Fermer', {
        duration: 3000,
      });
    });
  }

  saveState() {
    localStorage.setItem('incorrectAttempts', this.incorrectAttempts.toString());
    localStorage.setItem('disableVerifyButton', this.disableVerifyButton.toString());
  }

  loadState() {
    const savedIncorrectAttempts = localStorage.getItem('incorrectAttempts');
    const savedDisableVerifyButton = localStorage.getItem('disableVerifyButton');
    const lastSendAttempt = localStorage.getItem('lastSendAttempt');

    if (savedIncorrectAttempts) {
      this.incorrectAttempts = parseInt(savedIncorrectAttempts, 10);
    }
    if (savedDisableVerifyButton === 'true') {
      this.disableVerifyButton = true;
      setTimeout(() => {
        this.disableVerifyButton = false;
        this.incorrectAttempts = 0;
        this.saveState();
      }, this.COOLDOWN_PERIOD);
    }

    if (lastSendAttempt) {
      const elapsedTime = Date.now() - parseInt(lastSendAttempt, 10);
      if (elapsedTime < this.COOLDOWN_PERIOD) {
        this.disableSendButton = true;
        setTimeout(() => {
          this.disableSendButton = false;
        }, this.COOLDOWN_PERIOD - elapsedTime);
      }
    }
  }
}
