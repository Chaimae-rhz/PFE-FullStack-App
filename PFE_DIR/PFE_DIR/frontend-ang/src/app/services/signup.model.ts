import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export enum UserRole {
  ÉTUDIANT='ÉTUDIANT',
  PROFESSEUR = 'PROFESSEUR',
  AUTRES='AUTRES'
}

@Injectable({
  providedIn: 'root'
})
export class UserDTO {
  lastName: string = '';
  firstName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  role: UserRole = UserRole.ÉTUDIANT;
  dateInscription:Date;
  phoneNumber:string='';
  programeId:string='';
  code:string='';
  constructor() {
    this.dateInscription=new Date();
  }
}
