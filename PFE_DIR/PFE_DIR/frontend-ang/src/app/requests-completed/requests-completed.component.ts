import { Component } from '@angular/core';
import {Demande} from "../services/demande.model";
import {DemandeService} from "../services/demande.service";
import {base64toBlob} from "../services/utils";

@Component({
  selector: 'app-requests-completed',
  templateUrl: './requests-completed.component.html',
  styleUrl: './requests-completed.component.css'
})
export class RequestsCompletedComponent {

  demandes: Demande[] = [];
  decodedImageURL: string = '';
  errorMessage: string = '';
  selectedDemandeId: number | null = null;
  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(private demandeService: DemandeService) { }

  ngOnInit(): void {
    this.fetchPendingDemandes();
  }

  fetchPendingDemandes() {
    this.demandeService.getProcessedDemandesForCurrentUser().subscribe((demandes: Demande[]) => {
      this.demandes = demandes;
      const demande = this.demandes[0];
      this.decodeImage(demande.file_imageBefore);
      this.decodeImage(demande.file_imageAfter);
    });
  }

  decodeImage(base64String: string) {
    const blob = base64toBlob(base64String, 'image/jpeg');
    this.decodedImageURL = URL.createObjectURL(blob);
  }

  toggleSpeech(text: string) {
    if (this.currentUtterance !== null && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      this.speechSynthesis.speak(utterance);
    }
  }

}
