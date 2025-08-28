import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {DashboardComponent} from "./dashboard/dashboard.component";
import {RequestsComponent} from "./requests/requests.component";
import {UsersComponent} from "./users/users.component";
import {LoadUsersComponent} from "./load-users/load-users.component";
import {LoadRequestsComponent} from "./load-requests/load-requests.component";
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthGuard} from "./guards/auth.guard";
import {AuthorizationGuard} from "./guards/authorization.guard";
import {UsersRequestsComponent} from "./users-requests/users-requests.component";
import {AddUsersComponent} from "./add-users/add-users.component";
import {UpdateProject} from "@angular/cdk/schematics";
import {UpdateUserComponent} from "./update-user/update-user.component";
import {UpdateDemandeComponent} from "./update-demande/update-demande.component";
import {PersonnelsListComponent} from "./personnels-list/personnels-list.component";
import {AdminRequestsComponent} from "./admin-requests/admin-requests.component";
import {AddPersonnelComponent} from "./add-personnel/add-personnel.component";
import {UpdatePersonnelComponent} from "./update-personnel/update-personnel.component";

import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {FormReinitialisationComponent} from "./form-reinitialisation/form-reinitialisation.component";
import {PersonnelRequestsComponent} from "./personnel-requests/personnel-requests.component";
import {AdminListComponent} from "./admin-list/admin-list.component";
import {CreateAdminComponent} from "./create-admin/create-admin.component";
import {UpdateAdminComponent} from "./update-admin/update-admin.component";
import {AccesDeniedComponent} from "./acces-denied/acces-denied.component";
import {ProfileComponent} from "./profile/profile.component";
import {EmailAdminComponent} from "./email-admin/email-admin.component";
import {AuthorisationInscComponent} from "./authorisation-insc/authorisation-insc.component";
import {ListePPRComponent} from "./liste-ppr/liste-ppr.component";



const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"forgotPassword",component:ForgotPasswordComponent},
  {path:"formReinitialisation",component:FormReinitialisationComponent},
  {path:"admin",component:AdminTemplateComponent,
    canActivate:[AuthGuard],
    children : [

      {path:"dashboard",component:DashboardComponent},

      {path:"requests",component:RequestsComponent},
      {
        path:"users",component:UsersComponent,

      },
      {path:"listeAdmin",component:AdminListComponent,
        canActivate: [AuthorizationGuard], data: { roles: ['SuperAdmin'] }},
      {
        path:"loadUsers",component:LoadUsersComponent,

      },
      {path:"loadRequests",component:LoadRequestsComponent},
      {
        path:"usersRequests",component:UsersRequestsComponent,

      },
      {path:"addUsers",component:AddUsersComponent},
      {path:"updateUser/:id",component:UpdateUserComponent},
      {path:"updateDemande/:id",component:UpdateDemandeComponent},
      {path:"personnelList",component:PersonnelsListComponent},
      {path:"addPersonnel" , component:AddPersonnelComponent},
      {path:"updatePersonnel/:id",component:UpdatePersonnelComponent},
      { path: 'requests/:id', component: AdminRequestsComponent },
      {path :"personnelRequests/:id",component:PersonnelRequestsComponent},
      {path:"createAdmin",component:CreateAdminComponent},
      {path:"updateAdmin/:id",component:UpdateAdminComponent},

      {path:"accessDenied",component:AccesDeniedComponent},
      {path:"profile",component:ProfileComponent},
      {path:"emailAdmin",component:EmailAdminComponent},
      {path:"authorisationInscription",component:AuthorisationInscComponent},
        {path:"ListePPR",component:ListePPRComponent}
    ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
