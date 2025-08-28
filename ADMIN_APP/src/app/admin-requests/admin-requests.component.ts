import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.css']
})
export class AdminRequestsComponent implements OnInit {

  public demandes: any;
  public dataSource: any;
  userId: number | undefined;
  public displayedColumns = ['id', 'username', 'title', 'description', 'file_imageBefore', 'priority', 'status', 'remarque','dateResubmission','file_imageAfter', 'createdAt'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const userIdString = params['id'];
      if (!isNaN(Number(userIdString))) {
        this.userId = parseInt(userIdString, 10);
        this.loadDemandes(this.userId);
      } else {
        console.error('ID de l\'utilisateur invalide : ', userIdString);
      }
    });
  }

  loadDemandes(userId: number) {
    this.httpClient.get<any[]>(`http://172.30.70.16:8082/users/${this.userId}/demandes`)
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
}
