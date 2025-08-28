import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersonneFSMService } from "../services/personneFSM.service";
import { PersonneFSM } from '../services/personneFSM.model';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-authorisation-insc',
  templateUrl: './authorisation-insc.component.html',
  styleUrls: ['./authorisation-insc.component.css']
})
export class AuthorisationInscComponent {

  user: PersonneFSM = new PersonneFSM();
  message: string | null = null;

  constructor(
    private personneFSMService: PersonneFSMService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  // Fonction pour valider le format de date "yyyy/mm/dd"
  isValidDateFormat(dateString: string): boolean {
    const dateFormatRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    return dateFormatRegex.test(dateString);
  }

  onSubmit() {
    // Formater la date de naissance au format requis avant de l'envoyer
    this.user.dateNaissance = this.formatDate(new Date(this.user.dateNaissance));

    // Envoyer la requête HTTP pour créer l'utilisateur
    this.personneFSMService.createUser(this.user).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.goToUsers();
        this._snackBar.open('PPR et date de naissance ajoutés avec succès!', 'Fermer', {
          duration: 5000
        });
      },
      error: (error) => {
        console.error('Error:', error);
        // Gérer l'erreur ici, par exemple afficher un message à l'utilisateur
        if (error.status === 409) {
          this._snackBar.open('Ce PPR existe déjà.', 'Fermer', {
            duration: 5000
          });
        } else {
          this._snackBar.open('Une erreur est survenue. Veuillez réessayer.', 'Fermer', {
            duration: 5000
          });
        }
      }
    });
  }
  goToUsers() {
    this.router.navigate(['/admin/users']);
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }

  // Format a date as YYYY/MM/DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  // Add leading zero if needed
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
