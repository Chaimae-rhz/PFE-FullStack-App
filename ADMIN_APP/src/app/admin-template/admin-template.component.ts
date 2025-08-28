import {Component, ViewChild} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import { Maintenance } from '../services/Maintenance.service';
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {
  appName: string = 'AssetsSci FSM';
  @ViewChild(MatMenuTrigger) maintenanceMenuTrigger!: MatMenuTrigger;
  maintenanceMode: boolean = false;
  constructor(public authService: AuthService, private _snackBar: MatSnackBar, private http: HttpClient,private maintenance :Maintenance) {
  }


  ngOnInit() {

    const maintenanceState = localStorage.getItem('maintenanceMode');
    if (maintenanceState) {
      this.maintenanceMode = JSON.parse(maintenanceState);
    }
  }
  logout() {
    this.authService.logout();
  }
  toggleMaintenanceMenu(): void {
    this.maintenanceMenuTrigger.toggleMenu();
  }
  toggleMaintenanceMode(mode: boolean) {
    this.maintenance.setMaintenanceMode(mode).subscribe(
      () => {
        this.maintenanceMode = mode; // Met à jour l'état de la maintenance
        const message = mode ? 'activé' : 'désactivé';
        this._snackBar.open(`Mode maintenance ${message}`, 'Fermer', {
          duration: 5000,
        });
        // Enregistrez l'état de la maintenance dans le stockage local
        localStorage.setItem('maintenanceMode', JSON.stringify(mode));
      },
      (error) => {
        this._snackBar.open('Erreur lors de la modification du mode maintenance', 'Fermer', {
          duration: 5000,
        });
        console.error('Erreur lors de la modification du mode maintenance:', error);
      }
    );
  }
}
