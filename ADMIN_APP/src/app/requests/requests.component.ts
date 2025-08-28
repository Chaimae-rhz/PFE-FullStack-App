import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import { DemandeService } from '../services/demande.service';
import { Demande } from '../services/demande.model';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Personnel} from "../services/personnel.model";
import {PersonnelService} from "../services/personnel.service";
import { AssignDemandeDTO } from '../services/assignDemande.model';
import { StateService } from '../services/StateService.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements  OnInit {
  public demandes: any;
  public dataSource: any;
  decodedImageURL: SafeUrl | undefined;
  personnels: Personnel[] = [];

  public displayedColumns = ['id', 'username', 'email', 'role', 'programeId', 'phoneNumber', 'title', 'description', 'file_imageBefore', 'priority', 'status', 'remarque', 'dateResubmission', 'file_imageAfter', 'createdAt','usernamePers', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpClient: HttpClient,public stateService: StateService,private personnelService: PersonnelService, private snackBar: MatSnackBar, private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private router: Router, private demandeService: DemandeService,public dialog: MatDialog ) {
  }

  ngOnInit() {
    this.httpClient.get('http://172.30.70.16:8082/demandes/byDateAndPriority')
      .subscribe({
        next: data => {
          this.demandes = data;
          this.dataSource = new MatTableDataSource(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: err => {
          console.log(err);
        }
      })
    this.loadPersonnels();
    this.loadData();


  }


  loadData() {
    this.httpClient.get<Demande[]>('http://172.30.70.16localhost:8082/demandes/byDateAndPriority')
      .subscribe({
        next: (data: Demande[]) => {
          this.demandes = data;
          this.dataSource = new MatTableDataSource(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // Décoder les images encodées en base64
          this.demandes.forEach((demande: Demande) => {
            demande.decodedImageAfter = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + demande.file_imageAfter);
          });
        },
        error: err => {
          console.log(err);
        }
      });
  }

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateDemande(id: number) {
    this.router.navigate(['/admin/updateDemande', id]);

  }


  deleteDemande(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.demandeService.deleteDemande(id).subscribe(
          (data: any) => {
            console.log(data);
            this.demandes = this.demandes.filter((demande: any) => demande.id !== id);
            this.dataSource.data = this.demandes;
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
  }






  loadPersonnels() {
    this.personnelService.getAllPersonnels().subscribe((data: Personnel[]) => {
      this.personnels = data;
    });
  }

  assignDemande(demandeId: number, personnelId: number) {
    const assignDTO: AssignDemandeDTO = { demandeId, personnelId };
    this.demandeService.assignDemande(assignDTO).subscribe(
      response => {
        console.log('Demande attribuée avec succès', response);
        // Mettre à jour localement la demande attribuée
        const demande = this.demandes.find((d: Demande) => d.id === demandeId);
        if (demande) {
          demande.personnel = this.personnels.find((p: Personnel) => p.id === personnelId) || null;
        }
      },
      error => {
        console.error('Erreur lors de l\'attribution de la demande', error);
      }
    );
  }

  unassignDemande(demandeId: number) {
    this.demandeService.unassignDemande(demandeId).subscribe(
      response => {
        console.log('Demande désassignée avec succès', response);
        const demande = this.demandes.find((d: Demande) => d.id === demandeId);
        if (demande) {
          demande.personnel = null;  // Retirer l'assignation localement
        }
      },
      error => {
        console.error('Erreur lors de la désassignation de la demande', error);
      }
    );
  }



}
