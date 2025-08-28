import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  totalRequests!: number;
  requestsByStatus!: number;
  requestsInProgress!: number;
  requestsProcessed!: number;
  requestsCanceled ! : number;
  requestsByPriority!: number;
  requestsUrgent ! : number;
  requestsLow ! : number;
  totalUsers!: number;
  totalPersonnel!: number;
  totalAdmin! :number;
  totalAdminSuper!:number;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/total').subscribe(data => {
      this.totalRequests = data;
    });

    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byStatus?status=EN_ATTENTE').subscribe(data => {
      this.requestsByStatus = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byStatus?status=EN_COURS').subscribe(data => {
      this.requestsInProgress = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byStatus?status=TRAITÉE').subscribe(data => {
      this.requestsProcessed = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byStatus?status=REJETÉE').subscribe(data => {
      this.requestsCanceled = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byPriority?priority=NORMALE').subscribe(data => {
      this.requestsByPriority = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byPriority?priority=URGENTE').subscribe(data => {
      this.requestsUrgent = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/requests/byPriority?priority=BASSE').subscribe(data => {
      this.requestsLow = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/users/total').subscribe(data => {
      this.totalUsers = data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/personnel/total').subscribe(data => {
      this.totalPersonnel= data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/admin/total').subscribe(data => {
      this.totalAdmin= data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/admin/total').subscribe(data => {
      this.totalAdmin= data;
    });
    this.http.get<number>('http://172.30.70.16:8082/statistics/admin/super').subscribe(data => {
      this.totalAdminSuper= data;
    });
  }

}
