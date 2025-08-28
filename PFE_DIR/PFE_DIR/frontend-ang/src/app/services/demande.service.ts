import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, switchMap, throwError} from "rxjs";
import {Demande} from "./demande.model";

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://172.30.70.16:8082';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPendingDemandesForCurrentUser(): Observable<Demande[]> {
    const username = this.authService.getCurrentUser();
    return this.http.get<Demande[]>(`${this.apiUrl}/user/${username}/status/EN_ATTENTE`);
  }
  getInProgressDemandesForCurrentUser():Observable<Demande[]>{
    const username = this.authService.getCurrentUser();
    return this.http.get<Demande[]>(`${this.apiUrl}/user/${username}/status/EN_COURS`);
  }

  renvoyerDemande(demandeId: number): Observable<any> {
    // Appeler le backend pour obtenir la date de création et la date de renvoi actuelle de la demande
    return this.http.get<any>(`${this.apiUrl}/demandes/${demandeId}`).pipe(
      switchMap((demande: Demande) => {
        const dateCreation = new Date(demande.createdAt);
        const dateActuelle = new Date();

        // Vérifier si la demande a déjà été renvoyée
        if (demande.dateResubmission) {
          const dateResubmission = new Date(demande.dateResubmission);
          const differenceEnMilliseconds = dateActuelle.getTime() - dateResubmission.getTime();
          const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24);

          if (differenceEnJours < 4) {
            // Si moins d'un jour s'est écoulé depuis la dernière date de renvoi, afficher un message d'erreur
            return throwError('La demande a été renvoyée il y a moins de 4 jours. Veuillez attendre au moins 4 jours avant de renvoyer à nouveau.');
          }
        } else {
          // Si la date de renvoi n'est pas initialisée, vérifier si au moins un jour s'est écoulé depuis la date de création
          const differenceEnMilliseconds = dateActuelle.getTime() - dateCreation.getTime();
          const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24);

          if (differenceEnJours < 7) {
            // Si moins d'un jour s'est écoulé depuis la date de création, afficher un message d'erreur
            return throwError('Il doit s\'écouler au moins 4 jours avant de renvoyer la demande.');
          }
        }

        // Si toutes les conditions sont remplies, initialiser la date de renvoi et renvoyer la demande
        const dateResubmission = new Date();
        return this.http.put(`${this.apiUrl}/updateDateResubmission/${demandeId}`, { dateResubmission }).pipe(
          switchMap(() => {
            // Retourner un observable contenant le message de succès
            return new Observable(observer => {
              observer.next('La demande a été renvoyée avec succès.');
              observer.complete();
            });
          })
        );
      })
    );
  }


  getProcessedDemandesForCurrentUser():Observable<Demande[]>{
    const username = this.authService.getCurrentUser();
    return this.http.get<Demande[]>(`${this.apiUrl}/user/${username}/status/TRAITÉE`);
  }

  getCountByUserAndStatus(username: string, status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count?username=${username}&status=${status}`);
  }

  getCountByUser(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countByUser?username=${username}`);
  }
  getCountByUserAndPriority(username: string, priority: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countByPriority?username=${username}&priority=${priority}`);
  }
  getCountDemandesRenvoyeesByUser(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/countRenvoyees?username=${username}`);
  }
}
