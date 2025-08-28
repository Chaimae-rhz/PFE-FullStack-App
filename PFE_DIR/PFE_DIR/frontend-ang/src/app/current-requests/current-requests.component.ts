import { Component } from '@angular/core';
import {Demande} from "../services/demande.model";
import {DemandeService} from "../services/demande.service";
import { base64toBlob } from '../services/utils';

@Component({
  selector: 'app-current-requests',
  templateUrl: './current-requests.component.html',
  styleUrl: './current-requests.component.css'
})
export class CurrentRequestsComponent {
  demandes: Demande[] = [];
  decodedImageURL: string = '';

  constructor(private demandeService: DemandeService) { }
  ngOnInit(): void {
    this.fetchPendingDemandes();
  }

  fetchPendingDemandes() {
    this.demandeService.getInProgressDemandesForCurrentUser().subscribe((demandes: Demande[]) => {
      this.demandes = demandes;
      const demande = this.demandes[0];
      this.decodeImage(demande.file_imageBefore);
    });
  }

  decodeImage(base64String: string) {
    const blob = base64toBlob(base64String, 'image/jpeg');
    this.decodedImageURL = URL.createObjectURL(blob);
  }



}
