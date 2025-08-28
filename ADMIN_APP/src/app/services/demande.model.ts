import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserDTO} from "./user.model";
import { SafeUrl } from '@angular/platform-browser';
import { Personnel } from './personnel.model';




@Injectable({
  providedIn: 'root'
})

export class Demande {
   id ? : number;
  title: string = '';
  description: string = '';
  createdAt: Date = new Date();
  dateResubmission: Date = new Date();
  status: DemandeStatus = DemandeStatus.EN_COURS;
  priority: DemandePriority = DemandePriority.URGENTE;
  remarque:string='';
  file_imageBefore:string='';
  file_imageAfter :string='';
  user: UserDTO = {} as UserDTO;
  personnel :Personnel ={} as Personnel;
  decodedImageAfter?: SafeUrl;
  prixReparation?: number;
}
export interface UpdateDemandeResponse {
  id?: number;
}

export enum DemandeStatus {
   EN_ATTENTE='EN_ATTENTE',
  EN_COURS='EN_COURS',
  REJETÉE ='REJETÉE',
  TRAITÉE ='TRAITÉE'

}
export enum DemandePriority {
   URGENTE ='URGENTE',
  NORMALE ='NORMALE',
  BASSE ='BASSE'
}
