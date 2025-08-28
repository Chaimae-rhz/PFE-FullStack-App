import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DemandeService} from "../services/demande.service";
import { HttpHeaders } from '@angular/common/http';
import {Demande, DemandeStatus, UpdateDemandeResponse} from "../services/demande.model";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserDTO, UserRole} from "../services/user.model";

@Component({
  selector: 'app-update-demande',
  templateUrl: './update-demande.component.html',
  styleUrl: './update-demande.component.css'
})
export class UpdateDemandeComponent implements OnInit {
  selectedImage!: File;
  demandeFormGroup!: FormGroup;
  currentDemande: any;
  statusOptions: DemandeStatus[] = Object.values(DemandeStatus);
  showSuccessMessage: boolean = false; // Déclaration de la variable showSuccessMessage

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private demandeService: DemandeService,
    private route: ActivatedRoute, private sanitizer: DomSanitizer,private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    // Initialiser le formulaire de demande

    this.demandeFormGroup = this.fb.group({
      id: this.fb.control(null),
      username: this.fb.control(null),
      email: this.fb.control(null),
      role: this.fb.control(null),
      programeId: this.fb.control(null),
      phoneNumber: this.fb.control(null),
      title: this.fb.control(null),
      description: this.fb.control(null),
      file_imageBefore: [null],
      file_imageAfter: this.fb.control(null),
      createdAt: this.fb.control(null),
      priority: this.fb.control(null), // Ajoutez cette ligne pour le contrôle 'faceID'
      status: this.fb.control(null),
     dateResubmission :this.fb.control(null),
      remarque:this.fb.control(null)

    });


    // Récupérer la demande actuelle par son ID
    const demandeId = this.route.snapshot.params['id'];
    this.demandeService.getDemandeById(demandeId).subscribe((demande: any) => {
      this.currentDemande = demande;
      this.populateFormWithDemandeData();

    });
  }

  updateDemandeAction() {
    // Récupérer la demande actuelle par son ID
    const demandeId = this.route.snapshot.params['id'];
    const id: number = demandeId; // Déclaration de la variable id et assignation de la valeur demandeId

    let encodedFile: string | null = null;
// Vérifier si un fichier a été sélectionné
    if (this.selectedImage) {
// Encodage du fichier en Base64
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedImage);
      reader.onload = () => {
        encodedFile = reader.result as string;
// Création de l&#39;objet DemandeDTO avec le fichier encodé

        const demande: Demande = {
          id: this.demandeFormGroup.value.id,
          title: this.demandeFormGroup.value.title,
          description: this.demandeFormGroup.value.description,
          priority: this.demandeFormGroup.value.priority,
          createdAt: this.demandeFormGroup.value.createdAt,
          status: this.demandeFormGroup.value.status,
          file_imageBefore: this.demandeFormGroup.value.file_imageBefore,
          dateResubmission: this.demandeFormGroup.value.dateResubmission,
          remarque:this.demandeFormGroup.value.remarque,
          prixReparation:this.demandeFormGroup.value.prixReparation,
          user: {
            username: this.demandeFormGroup.value.username,
            role: this.demandeFormGroup.value.role,
            programeId: this.demandeFormGroup.value.programeId,
            email: this.demandeFormGroup.value.email,
            phoneNumber: this.demandeFormGroup.value.phoneNumber,
            password:this.demandeFormGroup.value.password,
            dateInscription:this.demandeFormGroup.value.dateInscription
          },
          personnel :{
            usernamePers: this.demandeFormGroup.value.usernamePers,
            email: this.demandeFormGroup.value.email,
            phoneNumber: this.demandeFormGroup.value.phoneNumber,
            dateOfBirth:this.demandeFormGroup.value.dateOfBirth,
            hireDate:this.demandeFormGroup.value.hireDate,
            firstName:this.demandeFormGroup.value.firstName,
            lastName:this.demandeFormGroup.value.lastName,
            position:this.demandeFormGroup.value.position
          },

          file_imageAfter: encodedFile || ''
        };
        // Appel du service pour ajouter la demande
        this.demandeService.updateDemande(id, demande).subscribe(
          (data: UpdateDemandeResponse) => {
            // Récupérer l&#39;ID de la demande créée à partir de data
            const demandeId = data.id;
            console.log("ID de la demande modifiée :", demandeId);
// Vérifier si demandeId est défini avant de l&#39;utiliser
            if (demandeId !== undefined) {


              this.router.navigate(['/admin/requests']);
              this._snackBar.open('Demande modifiée avec succès!', 'Fermer', {
                duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
              });
            } else {
              console.error("ID de la demande modifiée est indéfini.");

            }
          },
          (error) => {
            console.log(error);
// Gérer les erreurs ici
          }
        );
      };
    } else {


      const demande: Demande = {
        id: this.demandeFormGroup.value.id,
        title: this.demandeFormGroup.value.title,
        description: this.demandeFormGroup.value.description,
        priority: this.demandeFormGroup.value.priority,
        createdAt: this.demandeFormGroup.value.createdAt,
        status: this.demandeFormGroup.value.status,
        file_imageBefore: this.demandeFormGroup.value.file_imageBefore,
        dateResubmission: this.demandeFormGroup.value.dateResubmission,
        remarque:this.demandeFormGroup.value.remarque,
        prixReparation:this.demandeFormGroup.value.prixReparation,
        user: {
          username: this.demandeFormGroup.value.username,
          role: this.demandeFormGroup.value.role,
          programeId: this.demandeFormGroup.value.programeId,
          email: this.demandeFormGroup.value.email,
          phoneNumber: this.demandeFormGroup.value.phoneNumber,
          password:this.demandeFormGroup.value.password,
          dateInscription:this.demandeFormGroup.value.dateInscription
        },
        personnel :{
          usernamePers: this.demandeFormGroup.value.usernamePers,
          email: this.demandeFormGroup.value.email,
          phoneNumber: this.demandeFormGroup.value.phoneNumber,
          dateOfBirth:this.demandeFormGroup.value.dateOfBirth,
          hireDate:this.demandeFormGroup.value.hireDate,
          firstName:this.demandeFormGroup.value.firstName,
          lastName:this.demandeFormGroup.value.lastName,
          position:this.demandeFormGroup.value.position
        },

        file_imageAfter: ''
      };
      // Appel du service pour ajouter la demande
      this.demandeService.updateDemande(id, demande).subscribe(
        (data: UpdateDemandeResponse) => {

          const demandeId = data.id;
          console.log("ID de la demande modifiée:", demandeId);
// Vérifier si demandeId est défini avant de l&#39;utiliser
          if (demandeId !== undefined) {

            this.router.navigate(['/admin/requests']);
            this._snackBar.open('Demande modifiée avec succès!', 'Fermer', {
              duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
            });
          } else {
            console.error("L'ID de la demande modifiée est indéfini.");

          }
        },
        (error) => {
          console.log(error);

        }
      );

    }

  }

  goToDemandeList() {
    this.router.navigate(['/admin/requests']);
  }

  cancel() {
    this.router.navigate(['/admin/requests']);
  }

  populateFormWithDemandeData() {
    if (this.currentDemande) {
      this.demandeFormGroup.patchValue({
        id: this.currentDemande.id,
        username: this.currentDemande.user ? this.currentDemande.user.username : null, // Vérifiez si user est défini avant d'accéder au champ username
        role: this.currentDemande.user ? this.currentDemande.user.role : null,
        email: this.currentDemande.user ? this.currentDemande.user.email : null,
        programeId: this.currentDemande.user ? this.currentDemande.user.programeId : null,
        phoneNumber: this.currentDemande.user ? this.currentDemande.user.phoneNumber : null,
        title: this.currentDemande.title,
        description: this.currentDemande.description,
        file_imageBefore: this.currentDemande.file_imageBefore || null,
        priority: this.currentDemande.priority,
        // etc. Remplissez les autres champs du formulaire avec les données de l'utilisateur

        // Nouveaux champs du formulaire
        status: this.currentDemande.status ,
        file_imageAfter: this.currentDemande.file_imageAfter || null,
        createdAt: this.currentDemande.createdAt,
        dateResubmission:this.currentDemande.dateResubmission || null,
        remarque:this.currentDemande.remarque || null


      });
    }
  }

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']) {
      return fieldName + " is required";
    } else return "";
  }


  onImageSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.currentDemande.file_imageAfter = file.name; // Mettre à jour la propriété file_imageAfter avec le nom du fichier
      this.demandeFormGroup.patchValue({
        file_imageAfter: file.name // Mettre à jour la valeur dans le formulaire avec le nom du fichier
      });
      this.selectedImage = file;
      console.log("Selected file:", this.selectedImage);
      console.log("Base64 string:", base64String);
    };
    reader.readAsDataURL(file);
  }

}




