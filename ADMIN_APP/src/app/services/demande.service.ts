import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { UserDTO} from "./user.model";
import {UpdateUserModel} from "./updateUser.model";
import {Demande} from "./demande.model";
import {AssignDemandeDTO} from "./assignDemande.model";


@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private baseUrl = 'http://172.30.70.16:8082'; // URL du backend

  constructor(private httpClient: HttpClient) { }




  updateDemande(id: number, demande :Demande):Observable<object> {
    const formData: FormData = new FormData();
    formData.append('title', demande.title);
    formData.append('title', demande.title);
    formData.append('description', demande.description);
    formData.append('priority', demande.priority.toString());
    formData.append('status', demande.status.toString());
    formData.append('file_imageBefore', demande.file_imageBefore);
    formData.append('file_imageAfter', demande.file_imageAfter);

    return this.httpClient.put(`${this.baseUrl}/${id}/update` , demande);
  }
   deleteDemande(id : number): Observable<object>{
     return this.httpClient.delete(`${this.baseUrl}/deleteDemande/${id}`);
   }

  getDemandeById(demandeId: string) {
    const url = `${this.baseUrl}/demandes/${demandeId}`;
    return this.httpClient.get(url);
  }
  getCurrentDemande(): Observable<Demande[]> {
    const url = `${this.baseUrl}/demandes`; // Endpoint pour récupérer les demandes actuelles
    return this.httpClient.get<Demande[]>(url);

  }
  assignDemande(assignDTO: AssignDemandeDTO): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/demandes/assign`,  assignDTO);
  }
  updatePrixReparation(id: number, prixReparation: number): Observable<object> {
    const payload = { prixReparation: prixReparation };
    return this.httpClient.put(`${this.baseUrl}/demandes/${id}/prixReparation`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
// dans demande.service.ts
  unassignDemande(demandeId: number): Observable<Demande> {
    return this.httpClient.put<Demande>(`${this.baseUrl}/demandes/${demandeId}/unassign`, {});
  }

}
