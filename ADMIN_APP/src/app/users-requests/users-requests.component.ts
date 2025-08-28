import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-users-requests',
  templateUrl: './users-requests.component.html',
  styleUrl: './users-requests.component.css'
})
export class UsersRequestsComponent {
  public users : any;

  public dataSource : any;
  public displayedColumns=['id','firstName','lastName','email','role','demandes'];
  @ViewChild(MatPaginator) paginator! :MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(private http : HttpClient, private router : Router) {
  }
  ngOnInit() {
    this.http.get('http://172.30.70.16:8082/users')
      .subscribe({
        next: data => {
          this.users=data;
          this.dataSource = new MatTableDataSource(this.users);
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

  requests(id :number) {
    this.router.navigate(['/admin/requests',id]);
  }

}
