import {Component, OnInit} from '@angular/core';
import { MaintenanceService } from '../services/MaiantenanceService.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css'
})
export class MaintenanceComponent implements OnInit {

  constructor(private maintenanceService: MaintenanceService, private router: Router) {
  }

  ngOnInit(): void {
    this.maintenanceService.getMaintenanceMode().subscribe(isMaintenance => {
      if (!isMaintenance) {
        this.router.navigate(['/login']);
      }
    });
  }


}
