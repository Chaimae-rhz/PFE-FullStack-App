// src/app/services/maintenance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private maintenanceUrl = 'http://172.30.70.16:8082/maintenance'; // Assurez-vous que c'est l'URL correcte

  constructor(private http: HttpClient) {}

  getMaintenanceMode(): Observable<boolean> {
    return this.http.get<boolean>(this.maintenanceUrl);
  }
}
