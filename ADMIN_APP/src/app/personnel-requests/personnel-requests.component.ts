import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import { Demande } from '../services/demande.model';
import {DemandeService} from "../services/demande.service";

@Component({
  selector: 'app-personnel-requests',
  templateUrl: './personnel-requests.component.html',
  styleUrl: './personnel-requests.component.css'
})
export class PersonnelRequestsComponent implements OnInit{

  public demandes: any;
  public dataSource: any;
  personnelId: number | undefined;
  public displayedColumns =['id', 'username', 'email', 'role', 'programeId', 'phoneNumber', 'title', 'description', 'file_imageBefore', 'priority', 'status', 'remarque', 'dateResubmission', 'file_imageAfter', 'createdAt','prixReparation'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private demandeService: DemandeService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const personnelIdString = params['id'];
      if (!isNaN(Number(personnelIdString))) {
        this.personnelId = parseInt(personnelIdString, 10);
        this.loadDemandes(this.personnelId);
      } else {
        console.error('ID de l\'utilisateur invalide : ', personnelIdString);
      }
    });
  }

  loadDemandes(personnelId: number) {
    this.httpClient.get<any[]>(`http://172.30.70.16:8082/personnels/${this.personnelId}/demandesAttribuees`)
      .subscribe(demandes => {
        this.demandes = demandes;
        this.dataSource = new MatTableDataSource(this.demandes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        console.error('Erreur lors de la récupération des demandes : ', error);
      });
  }

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  updateRepairPrice(element: Demande, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newPrice = parseFloat(inputElement.value);
    if (!isNaN(newPrice)) {
      element.prixReparation = newPrice;
      // Vérifier si element.id est défini
      if (element.id !== undefined) {
        // Appeler la méthode seulement si element.id est défini
        this.demandeService.updatePrixReparation(element.id, newPrice).subscribe({
          next: () => console.log('Prix de réparation mis à jour avec succès'),
          error: (error) => console.error('Erreur lors de la mise à jour du prix de réparation : ', error)
        });
      } else {
        console.error('Erreur : element.id est undefined.');
      }
    }
  }

}
