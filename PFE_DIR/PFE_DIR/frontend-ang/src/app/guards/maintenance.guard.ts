import { Injectable } from '@angular/core';
import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {MaintenanceService} from "../services/MaiantenanceService.service";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  constructor(private maintenanceService: MaintenanceService, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.maintenanceService.getMaintenanceMode().pipe(
      map(isMaintenance => {
        if (isMaintenance) {
          this.router.navigate(['/maintenance']);
          return false;
        }
        return true;
      })
    );
  }
}
