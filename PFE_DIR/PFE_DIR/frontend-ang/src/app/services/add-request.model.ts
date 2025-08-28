import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


export enum DemandePriority{
  URGENTE ='URGENTE',
  NORMALE ='NORMALE',
  BASSE ='BASSE'
}
export enum DemandeStatus{
  EN_ATTENTE='EN_ATTENTE',
}
@Injectable({
  providedIn: 'root'
})
export class DemandeDTO{
  id?: number;
  title : string ='';
  description :string = '';
  priority : DemandePriority=DemandePriority.NORMALE;
  createdAt: Date; // Défini comme un objet de type Date
  status : DemandeStatus=DemandeStatus.EN_ATTENTE;
  file_imageBefore: string='';
  constructor() {
    this.createdAt = new Date(); // Initialisation à la date actuelle lors de la création
    status=DemandeStatus.EN_ATTENTE;
  }
}
export interface AddDemandeResponse {
  id?: number;

}
export interface DemandeDTO {
  id?: number; // Le '?' indique que la propriété est nullable
  title: string;
  description: string;
  priority: DemandePriority;
  createdAt: Date;
  status:DemandeStatus;
  file_imageBefore :string;
}
