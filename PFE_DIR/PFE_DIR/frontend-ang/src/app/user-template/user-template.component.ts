import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {DemandeService} from "../services/demande.service";

@Component({
  selector: 'app-user-template',
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {
  username: string | undefined;
  countTraitee: number = 0;
  countRejetee: number = 0;
  countEnAttente: number = 0;
  countEnCours: number = 0;
  totalDemandes: number = 0;
  countUrgente: number = 0;
  countNormale: number = 0;
  countBasse: number = 0;
  countRenvoyees: number = 0;
  appName: string = 'AssetsSci FSM';

  constructor(public authService :AuthService, private demandeService: DemandeService){

  }

  ngOnInit(): void {
    this.username = this.authService.getCurrentUser();
    if (this.username) {
      this.getCounts(this.username);
      this.getTotalDemandes(this.username);
      this.getCountsByPriority(this.username);
      this.getCountDemandesRenvoyees(this.username);
    }
  }
  logout() {
    this.authService.logout();
  }

  getCounts(username: string): void {
    this.demandeService.getCountByUserAndStatus(username, 'TRAITÉE').subscribe(count => this.countTraitee = count);
    this.demandeService.getCountByUserAndStatus(username, 'REJETÉE').subscribe(count => this.countRejetee = count);
    this.demandeService.getCountByUserAndStatus(username, 'EN_ATTENTE').subscribe(count => this.countEnAttente = count);
    this.demandeService.getCountByUserAndStatus(username, 'EN_COURS').subscribe(count => this.countEnCours = count);
  }
  getTotalDemandes(username: string): void {
    this.demandeService.getCountByUser(username).subscribe(count => this.totalDemandes = count);
  }
  getCountsByPriority(username: string): void {
    this.demandeService.getCountByUserAndPriority(username, 'URGENTE').subscribe(count => this.countUrgente = count);
    this.demandeService.getCountByUserAndPriority(username, 'NORMALE').subscribe(count => this.countNormale = count);
    this.demandeService.getCountByUserAndPriority(username, 'BASSE').subscribe(count => this.countBasse = count);
  }
  getCountDemandesRenvoyees(username: string): void {
    this.demandeService.getCountDemandesRenvoyeesByUser(username).subscribe(count => this.countRenvoyees = count);
  }


}
