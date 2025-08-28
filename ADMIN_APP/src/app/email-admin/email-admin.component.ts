import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from "../services/email.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailAdmin } from '../services/EmailAdmin.model'; // Assurez-vous d'importer le modèle correct

@Component({
  selector: 'app-email-admin',
  templateUrl: './email-admin.component.html',
  styleUrls: ['./email-admin.component.css']
})
export class EmailAdminComponent implements OnInit {
  emailAdminForm!: FormGroup;
  public hidePassword = true;

  constructor(private emailService: EmailService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStoredData();
    this.loadEmailAdminData();
  }

  private initializeForm(): void {
    this.emailAdminForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required]]
    });
  }

  private loadStoredData(): void {
    const storedEmail = localStorage.getItem('newEmail');
    const storedPassword = localStorage.getItem('newPassword');

    console.log('Stored email:', storedEmail);  // Log des données stockées
    console.log('Stored password:', storedPassword);  // Log des données stockées

    if (storedEmail && storedPassword) {
      this.emailAdminForm.patchValue({
        newEmail: storedEmail,
        newPassword: storedPassword
      });
    }
  }

  private loadEmailAdminData(): void {
    this.emailService.getEmailAdmin().subscribe(
      (data: EmailAdmin) => {
        console.log('EmailAdmin data from API:', data);  // Log des données de l'API
        this.emailAdminForm.patchValue({
          newEmail: data.email,
          newPassword: data.password
        });

        // Mettre à jour le localStorage avec les données de l'API
        localStorage.setItem('newEmail', data.email);
        localStorage.setItem('newPassword', data.password);
      },
      error => {
        console.error('Error fetching email admin data', error);
      }
    );
  }

  onSubmit() {
    if (this.emailAdminForm.valid) {
      const { newEmail, newPassword } = this.emailAdminForm.value;

      this.emailService.updateEmailAdmin(newEmail, newPassword).subscribe(
        () => {
          console.log('Email admin updated successfully');
          this.snackBar.open('Email et mot de passe modifiés avec succès', 'Fermer', {
            duration: 3000,
          });

          // Mettre à jour le localStorage après une mise à jour réussie
          localStorage.setItem('newEmail', newEmail);
          localStorage.setItem('newPassword', newPassword);

          // Charger les données pour s'assurer qu'elles sont mises à jour
          this.loadStoredData();
          this.loadEmailAdminData();
        },
        error => {
          console.error('Error updating email admin', error);
          this.snackBar.open('Erreur lors de la modification de l\'email et du mot de passe', 'Fermer', {
            duration: 3000,
          });
        }
      );
    }
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
