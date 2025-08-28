import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DemandeDTO} from "./add-request.model";
import {EmailRequest} from "./email-request.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'http://172.30.70.16:8082';
  currentUserEmail: string | undefined;
  constructor(private httpClient: HttpClient) {

  }


  addDemande( demande :DemandeDTO) : Observable<object>{
    const formData: FormData = new FormData();
    formData.append('title', demande.title);
    formData.append('description', demande.description);
    formData.append('priority', demande.priority);
    formData.append('status', demande.status);
    formData.append('file_imageBefore', demande.file_imageBefore);

    return this.httpClient.post(`${this.apiUrl}/addDemande` , demande);
  }

  assignUserToDemande(demandeId: number, username: string): Observable<string> {
    return this.httpClient.post<string>(`${this.apiUrl}/${demandeId}/assign/${username}`, {});
  }
  sendEmail(emailRequest: EmailRequest): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/send-email`, emailRequest);
  }

}
