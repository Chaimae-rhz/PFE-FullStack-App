// add-request.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { AddDemandeResponse, DemandeDTO, DemandePriority, DemandeStatus } from "../services/add-request.model";
import { DemandeService } from "../services/add-request.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { EmailRequest } from "../services/email-request.model";

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {

  priorityOption: DemandePriority[] = Object.values(DemandePriority);
  demandeFormGroup!: FormGroup;
  demande: DemandeDTO = new DemandeDTO();
  currentUser: string | undefined;
  selectedImage: File | null = null;
  sending = false;
  imageInput!: HTMLInputElement;
  defaultDescription: string = "ampoule defectueuse [local block6:4]";
  currentUserEmail: string | undefined;
  imageError: string | null = null;
  previewUrl: string | null = null;
  countdown: { hours: number, minutes: number, seconds: number } = { hours: 0, minutes: 0, seconds: 0 };
  isCooldown: boolean = false;
  maxRequestsPerHour: number = 5;
  cooldownPeriod: number = 3600; // 1 hour in seconds

  constructor(
    private fb: FormBuilder,
    private demandeservice: DemandeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = this.demandeservice.currentUserEmail;
  }

  ngOnInit() {
    this.demandeFormGroup = this.fb.group({
      title: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      description: this.fb.control(this.defaultDescription, [Validators.required, Validators.minLength(4)]),
      priority: this.fb.control(null, [Validators.required]),
      file_imageBefore: this.fb.control([''])
    });

    this.currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = this.demandeservice.currentUserEmail;

    this.checkCooldown();
  }

  // Méthode pour vérifier le temps de refroidissement
  checkCooldown() {
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const now = new Date().getTime();

    // Filtrer les demandes qui ont été créées il y a moins d'une heure
    const recentRequests = requests.filter((timestamp: number) => (now - timestamp) < this.cooldownPeriod * 1000);

    if (recentRequests.length >= this.maxRequestsPerHour) {
      this.isCooldown = true;
      const oldestRequestTime = Math.min(...recentRequests);
      const remainingCooldownTime = (oldestRequestTime + this.cooldownPeriod * 1000 - now) / 1000;
      this.setCountdown(remainingCooldownTime);
      this.startCountdown();
    }

    // Mise à jour du stockage local avec les demandes récentes uniquement
    localStorage.setItem('requests', JSON.stringify(recentRequests));
  }

  // Méthode pour définir le compte à rebours
  setCountdown(seconds: number) {
    this.countdown.hours = Math.floor(seconds / 3600);
    this.countdown.minutes = Math.floor((seconds % 3600) / 60);
    this.countdown.seconds = Math.floor(seconds % 60);
  }

  // Méthode pour démarrer le compte à rebours
  startCountdown() {
    const interval = setInterval(() => {
      if (this.countdown.seconds > 0) {
        this.countdown.seconds--;
      } else {
        if (this.countdown.minutes > 0) {
          this.countdown.minutes--;
          this.countdown.seconds = 59;
        } else if (this.countdown.hours > 0) {
          this.countdown.hours--;
          this.countdown.minutes = 59;
          this.countdown.seconds = 59;
        } else {
          this.isCooldown = false;
          clearInterval(interval);
        }
      }
    }, 1000);
  }

  handleImageInput(event: any) {
    const file = event.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      this.imageError = 'Veuillez sélectionner uniquement un fichier image.';
      this.selectedImage = null;
      this.previewUrl = null;
      document.getElementById('fileName')!.textContent = 'Choisir une image';
    } else {
      this.imageError = null;
      const fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.demandeFormGroup.patchValue({
          file_imageBefore: base64String
        });
        this.selectedImage = file;
        this.previewUrl = base64String;
      };
      document.getElementById('fileName')!.textContent = fileName;
      reader.readAsDataURL(file);
    }
  }

  saveDemande() {
    const createdAt = new Date().getTime();
    let encodedFile: string | null = null;

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedImage);
      reader.onload = () => {
        encodedFile = reader.result as string;

        const demandeDTO: DemandeDTO = {
          title: this.demandeFormGroup.value.title,
          description: this.demandeFormGroup.value.description,
          priority: this.demandeFormGroup.value.priority,
          createdAt: new Date(),
          status: DemandeStatus.EN_ATTENTE,
          file_imageBefore: encodedFile || ''
        };

        this.submitDemande(demandeDTO, createdAt);
      };
    } else {
      const demandeDTO: DemandeDTO = {
        title: this.demandeFormGroup.value.title,
        description: this.demandeFormGroup.value.description,
        priority: this.demandeFormGroup.value.priority,
        createdAt: new Date(),
        status: DemandeStatus.EN_ATTENTE,
        file_imageBefore: ''
      };

      this.submitDemande(demandeDTO, createdAt);
    }
  }

  submitDemande(demandeDTO: DemandeDTO, createdAt: number) {
    this.demandeservice.addDemande(demandeDTO).subscribe(
      (data: AddDemandeResponse) => {
        const demandeId = data.id;

        if (demandeId !== undefined) {
          this.assignUserToDemande(demandeId, this.currentUser);
          const requests = JSON.parse(localStorage.getItem('requests') || '[]');
          requests.push(createdAt);
          localStorage.setItem('requests', JSON.stringify(requests));

          if (requests.length >= this.maxRequestsPerHour) {
            this.isCooldown = true;
            this.setCountdown(this.cooldownPeriod);
            this.startCountdown();
          }

          setTimeout(() => {
            this.sendEmail(demandeId);
            this.router.navigate(['/user/home']);
          }, 1000);
        } else {
          console.error("L'ID de la demande créée est indéfini.");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleDemande() {
    this.sending = true;
    this.saveDemande();
  }

  assignUserToDemande(demandeId: number, username: string | undefined) {
    if (username !== undefined) {
      this.demandeservice.assignUserToDemande(demandeId, username).subscribe(
        (data: any) => {
          this.router.navigate(['/user/home']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("Le nom d'utilisateur est indéfini.");
    }
  }

  sendEmail(demandeId: number): void {
    if (this.currentUser && this.currentUserEmail) {
      const emailRequest: EmailRequest = {
        to: this.currentUserEmail,
        subject: 'Votre demande a été reçue',
        body: this.buildHtmlEmailBody(this.currentUser, demandeId, this.demande)
      };

      this.demandeservice.sendEmail(emailRequest).subscribe(
        () => {
          console.log('E-mail envoyé avec succès!');
        },
        (error) => {
          console.error('Échec de l\'envoi de l\'e-mail:', error);
        }
      );
    } else {
      console.error("L'utilisateur ou l'e-mail de l'utilisateur est indéfini.");
    }
  }

  private buildHtmlEmailBody(user: string, demandeId: number, demande: { title: string; status: string }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;}
          .container {width: 100%; padding: 20px; background-color: #ffffff; border-radius: 10px; margin: 0 auto;}
          .header {background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0;}
          .content {padding: 20px;}
          .footer {background-color: #f4f4f4; color: #777; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;}
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>Votre demande a été reçue</h1>
          </div>
          <div class='content'>
            <p>Bonjour,</p>
            <p>L'utilisateur <strong>${user}</strong> a créé la demande avec les détails suivants :</p>
            <p><strong>ID de la demande :</strong> ${demandeId}<br>
            <strong>Titre :</strong> ${demande.title}<br>
            <strong>Statut :</strong> ${demande.status}</p>
            <p>Cordialement,</p>
            <p>AssetsSci</p>
          </div>
          <div class='footer'>
            <p>© 2023 AssetsSci. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']) {
      return `${fieldName} est requis`;
    } else if (error['minlength']) {
      return `${fieldName} doit comporter au moins ${error['minlength']['requiredLength']} caractères`;
    } else {
      return '';
    }
  }
}
