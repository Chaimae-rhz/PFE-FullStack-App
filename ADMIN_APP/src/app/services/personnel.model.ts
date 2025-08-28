import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class Personnel {
  id?:number;
  usernamePers: string='';
  firstName: string='';
  lastName: string='';
  dateOfBirth: string ='';
  phoneNumber: string='';
  position: PersonnelPosition=PersonnelPosition.ELECTRICIEN;
  hireDate: Date=new Date();
  email: string='';

}
export enum PersonnelPosition{

  PLOMBIER='PLOMBIER',
  ELECTRICIEN='ELECTRICIEN',
  CHAUFFAGISTE='CHAUFFAGISTE',
  JARDINIER='JARDINIER',
  MENUISIER='MENUISIER'
}
