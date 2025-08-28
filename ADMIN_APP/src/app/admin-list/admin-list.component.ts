import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit{
  public admins : any;
  public dataSource : any;
  public displayedColumns=['id','email','password','superAdmin','action'];
  @ViewChild(MatPaginator) paginator! :MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(private http : HttpClient, private router : Router , private adminService : AdminService) {
  }
  ngOnInit() {
    this.http.get('http://172.30.70.16:8082/allAdmin')
      .subscribe({
        next: data => {
          this.admins=data;
          this.dataSource = new MatTableDataSource(this.admins);
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




  handleAddAdmin() {
    this.router.navigateByUrl('/admin/createAdmin');
  }

  updateAdmin(id : number ) {
    this.router.navigate(['/admin/updateAdmin', id] );

  }

  deleteAdmin(id : number) {
    this.adminService.delateAdmin(id).subscribe(
      (data: any) => {
        console.log(data);
        this.admins = this.admins.filter((admin: any) => admin.id !== id);
        this.dataSource.data = this.admins;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
