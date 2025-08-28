import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Maintenance {
  private apiUrl = 'http://172.30.70.16:8082';

  constructor(private http: HttpClient) {}

  setMaintenanceMode(mode: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/maintenance?mode=${mode}`, {});
  }
  checkMaintenanceMode(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/maintenance`);
  }
}
