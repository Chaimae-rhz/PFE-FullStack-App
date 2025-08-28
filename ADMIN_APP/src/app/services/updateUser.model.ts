import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { UserRole } from './user.model';



@Injectable({
  providedIn: 'root'
})
export class UpdateUserModel {

  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  recoFaciale:boolean;
  programeId:string;
  code:string;
  phoneNumber:string;

  constructor() {
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.role = UserRole.ÉTUDIANT;
    this.recoFaciale = false;
    this.programeId = '';
    this.code = '';
    this.phoneNumber='';

  }
}
