import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent  implements OnInit{
    public users : any;
    public dataSource : any;
    public displayedColumns=['id','username','firstName','lastName','email','phoneNumber','password','role','programeId','dateInscription','action'];
    @ViewChild(MatPaginator) paginator! :MatPaginator;
    @ViewChild(MatSort) sort! : MatSort;

    constructor(private http : HttpClient, private router : Router , private userService : UserService) {
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


  getRequests(user:any) {
     this.router.navigateByUrl('/demandes');
  }

  handleAddUser() {
   this.router.navigateByUrl('/admin/addUsers');
  }

  updateUser(id : number ) {
      this.router.navigate(['/admin/updateUser', id] );

  }

  deleteUser(id : number) {
    this.userService.deleteUser(id).subscribe(
      (data: any) => {
        console.log(data);
        this.users = this.users.filter((user: any) => user.id !== id);
        this.dataSource.data = this.users;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  openAuthorizeForm() {
    this.router.navigateByUrl('/admin/authorisationInscription');
  }

}

