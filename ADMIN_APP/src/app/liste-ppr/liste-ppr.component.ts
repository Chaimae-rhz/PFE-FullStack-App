import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AdminService} from "../services/admin.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-liste-ppr',
  templateUrl: './liste-ppr.component.html',
  styleUrl: './liste-ppr.component.css'
})
export class ListePPRComponent {
  public personneFSM: any;
  public dataSource: any;
  public displayedColumns = ['id', 'ppr','dateNaissance'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.http.get('http://172.30.70.16:8082/personneFSM/all')
      .subscribe({
        next: data => {
          this.personneFSM = data;
          this.dataSource = new MatTableDataSource(this.personneFSM);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: err => {
          console.log(err);
        }
      })
  }

  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
