import { Component, OnInit } from '@angular/core';
import { Demande } from "../services/demande.model";
import { DemandeService } from "../services/demande.service";
import { base64toBlob } from '../services/utils';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  demandes: Demande[] = [];
  decodedImageURL: string = '';
  errorMessage: string = '';
  successMessage: string = ''; // Ajout de la variable pour le message de succès
  selectedDemandeId: number | null = null;
  errorMessageVisible: boolean = false;// Ajout de la variable pour gérer la visibilité du message d'erreur
  successMessageVisible: boolean=false;

  constructor(private demandeService: DemandeService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchPendingDemandes();
  }

  fetchPendingDemandes() {
    this.demandeService.getPendingDemandesForCurrentUser().subscribe((demandes: Demande[]) => {
      this.demandes = demandes;
      const demande = this.demandes[0];
      this.decodeImage(demande.file_imageBefore);
    });
  }

  decodeImage(base64String: string) {
    const blob = base64toBlob(base64String, 'image/jpeg');
    this.decodedImageURL = URL.createObjectURL(blob);
  }

  renvoyerDemande(id: number): void {
    this.selectedDemandeId = id;
    this.errorMessage = '';
    this.errorMessageVisible = false; // Réinitialisation de la visibilité du message d'erreur
    this.successMessageVisible=false;
    this.successMessage='';
    this.demandeService.renvoyerDemande(id).subscribe({
      next: (response: any) => {
        console.log(response); // Afficher le message de succès
        if(typeof  response ==='string'){
          this.successMessage = response;
          console.log(this.successMessage);
          console.log(this.successMessageVisible);
          this.successMessageVisible=true;
          this._snackBar.open(this.successMessage, 'Fermer', {
            duration: 5000, // Durée d'affichage du message en millisecondes
          });
        }

        // Vérifier si la demande a été renvoyée avec succès
        if (response.dateResubmission) {
          const dateResubmission = new Date(response.dateResubmission);
          const dateActuelle = new Date();
          const differenceEnMilliseconds = dateActuelle.getTime() - dateResubmission.getTime();
          const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24);



          if (differenceEnJours < 4) {
            // Si moins de 4 jours se sont écoulés depuis la dernière date de renvoi, afficher un message d'erreur
            this.errorMessage = 'La demande a été renvoyée il y a moins de 4 jours. Veuillez attendre au moins 4 jours avant de renvoyer à nouveau.';
            this.errorMessageVisible = true; // Afficher le message d'erreur
            setTimeout(() => {
              this.errorMessageVisible = false; // Masquer le message d'erreur après 15 secondes
            }, 15000); // 15 secondes en millisecondes
          } else {
            // Sinon, mettre à jour la date de renvoi



          }
        } else {
          // Si la date de renvoi est nulle, vérifier la date de création
          const dateCreation = new Date(response.createdAt);
          const dateActuelle = new Date();
          const differenceEnMilliseconds = dateActuelle.getTime() - dateCreation.getTime();
          const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24);

          if (differenceEnJours < 4) {
            // Si moins de 4 jours se sont écoulés depuis la date de création, afficher un message d'erreur
            this.errorMessage = 'Il doit s\'écouler au moins 4 jours avant de renvoyer la demande.';
            this.errorMessageVisible = true; // Afficher le message d'erreur
            setTimeout(() => {
              this.errorMessageVisible = false; // Masquer le message d'erreur après 15 secondes
            }, 15000); // 15 secondes en millisecondes
          } else {
            // Sinon, la demande peut être renvoyée
            console.log('La demande peut être renvoyée.');


          }
        }
      },
      error: (error) => {
        console.error(error);

        if (typeof error === 'string') {
          // Si l'erreur est une chaîne, cela signifie qu'elle est générée par le service en raison d'une condition de temps
          this.errorMessage = error; // Utiliser le message d'erreur généré par le service
          this.errorMessageVisible = true; // Afficher le message d'erreur
          setTimeout(() => {
            this.errorMessageVisible = false; // Masquer le message d'erreur après 15 secondes
          }, 15000); // 15 secondes en millisecondes
        } else {
          // Sinon, c'est une autre erreur inattendue, utiliser le message d'erreur par défaut
          this.errorMessage = 'Une erreur s\'est produite lors de la mise à jour de la date de resubmission pour la demande avec l\'ID: ' + id;
        }
      },
      complete: () => {
        this.selectedDemandeId = null; // Réinitialiser la sélection après la fin de la requête
      }
    });
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Fermer', {
      duration: 5000, // Durée d'affichage du message en millisecondes
    });
  }

}
