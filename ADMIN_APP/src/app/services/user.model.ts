import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export enum UserRole {
  ÉTUDIANT='ÉTUDIANT',
  PROFESSEUR = 'PROFESSEUR',

}

@Injectable({
  providedIn: 'root'
})
export class UserDTO {
  username: string = '';
  email: string = '';
  password: string = '';
  role: UserRole = UserRole.ÉTUDIANT;
  dateInscription: Date=new Date();
  phoneNumber :string='';
  programeId:string='';
}
