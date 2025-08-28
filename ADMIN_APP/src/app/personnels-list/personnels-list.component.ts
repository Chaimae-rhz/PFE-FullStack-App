import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {PersonnelService} from "../services/personnel.service";

@Component({
  selector: 'app-personnels-list',
  templateUrl: './personnels-list.component.html',
  styleUrl: './personnels-list.component.css'
})
export class PersonnelsListComponent implements  OnInit{
  public personnels : any;
  public dataSource : any;
  public displayedColumns=['id','usernamePers','firstName','lastName','email','dateOfBirth','position','hireDate','phoneNumber','action','requests'];
  @ViewChild(MatPaginator) paginator! :MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(private http : HttpClient, private router : Router , private personnelService : PersonnelService ) {
  }
  ngOnInit() {
    this.http.get('http://172.30.70.16:8082/personnels')
      .subscribe({
        next: data => {
          this.personnels=data;
          this.dataSource = new MatTableDataSource(this.personnels);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
        },
        error : err => {
          console.log(err);
        }
      })
  }
  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleAddPersonnel() {
    this.router.navigateByUrl('/admin/addPersonnel');
  }

  updatePersonnel(id : number ) {
    this.router.navigate(['/admin/updatePersonnel', id] );

  }

  deletePersonnel(id : number) {
    this.personnelService.deletePersonnel(id).subscribe(
      (data: any) => {
        console.log(data);
        this.personnels = this.personnels.filter((personnel: any) => personnel.id !== id);
        this.dataSource.data = this.personnels;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRequests(id : number) {
      this.router.navigate(['/admin/personnelRequests',id]);
  }
}
