import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { UserDTO} from "./user.model";
import {UpdateUserModel} from "./updateUser.model";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://172.30.70.16:8082'; // URL du backend

  constructor(private httpClient: HttpClient) { }


  addUsers( user : UserDTO) : Observable<object>{
    return this.httpClient.post(`${this.baseUrl}/ADMINaddUsers` , user)
  }
  getUserById(userId: string) {
    const url = `${this.baseUrl}/usersById/${userId}`;
    return this.httpClient.get(url);
  }
  updateUser(id : number , updateUserModel : UpdateUserModel): Observable<object>{
    return  this.httpClient.put(`${this.baseUrl}/updateUsers/${id}`,updateUserModel);
  }
   deleteUser(id : number): Observable<object>{
     return this.httpClient.delete(`${this.baseUrl}/deleteUser/${id}`);
   }
}
