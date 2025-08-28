import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProfileComponent} from "./profile/profile.component";
import {LoginComponent} from "./login/login.component";
import {AddRequestComponent} from "./add-request/add-request.component";
import {CurrentRequestsComponent} from "./current-requests/current-requests.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RequestsCompletedComponent} from "./requests-completed/requests-completed.component";
import {UserTemplateComponent} from "./user-template/user-template.component";
import {AuthGuard} from "./guards/auth.guard";
import {SignupComponent} from "./signup/signup.component";
import { MaintenanceComponent } from './maintenance/maintenance.component';
import {MaintenanceGuard} from "./guards/maintenance.guard";

const routes: Routes = [
  {path : "",component: LoginComponent, canActivate: [MaintenanceGuard]},
  {path : "login",component: LoginComponent, canActivate: [MaintenanceGuard]},
  {path:"signup",component:SignupComponent, canActivate: [MaintenanceGuard]},
  {path : "user",component: UserTemplateComponent ,canActivate : [AuthGuard, MaintenanceGuard], children : [
      {path : "home",component: HomeComponent, canActivate: [MaintenanceGuard]},
      {path : "profile",component: ProfileComponent, canActivate: [MaintenanceGuard]},
      {path : "add-request",component: AddRequestComponent, canActivate: [MaintenanceGuard]},
      {path : "current-requests",component: CurrentRequestsComponent, canActivate: [MaintenanceGuard]},
      {path : "dashboard",component: DashboardComponent, canActivate: [MaintenanceGuard]},
      {path : "requests-completed",component: RequestsCompletedComponent, canActivate: [MaintenanceGuard]},
    ]},
  { path: 'maintenance', component: MaintenanceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
