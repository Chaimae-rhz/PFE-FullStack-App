import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { UserDTO} from "./user.model";
import {UpdateUserModel} from "./updateUser.model";
import {Personnel} from "./personnel.model";


class UpdatePersonnelModel {
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private baseUrl = 'http://172.30.70.16:8082'; // URL du backend

  constructor(private httpClient: HttpClient) { }


  addPersonnel( personnel : Personnel) : Observable<object>{
    return this.httpClient.post(`${this.baseUrl}/addPersonnel` , personnel)
  }
  getPersonnelById(personnelId: string) {
    const url = `${this.baseUrl}/personnelsById/${personnelId}`;
    return this.httpClient.get(url);
  }
  updatePersonnel(id : number ,personnel : Personnel): Observable<object>{
    return  this.httpClient.put(`${this.baseUrl}/updatePersonnels/${id}`,personnel);
  }
   deletePersonnel(id : number): Observable<object>{
     return this.httpClient.delete(`${this.baseUrl}/deletePersonnel/${id}`);
   }

  getAllPersonnels(): Observable<Personnel[]> {
    const url = `${this.baseUrl}/personnels`; // Concaténez "/personnels" à l'URL de base
    return this.httpClient.get<Personnel[]>(url);
  }
}
