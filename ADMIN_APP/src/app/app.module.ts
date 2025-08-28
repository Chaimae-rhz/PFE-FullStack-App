import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { RequestsComponent } from './requests/requests.component';
import {MatCardModule} from "@angular/material/card";
import { LoadUsersComponent } from './load-users/load-users.component';
import { LoadRequestsComponent } from './load-requests/load-requests.component';
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./guards/auth.guard";
import {AuthorizationGuard} from "./guards/authorization.guard";
import {HttpClientModule} from "@angular/common/http";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { UsersRequestsComponent } from './users-requests/users-requests.component';
import { AddUsersComponent } from './add-users/add-users.component';
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { UpdateUserComponent } from './update-user/update-user.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { UpdateDemandeComponent } from './update-demande/update-demande.component';
import { PersonnelsListComponent } from './personnels-list/personnels-list.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { AddPersonnelComponent } from './add-personnel/add-personnel.component';
import { UpdatePersonnelComponent } from './update-personnel/update-personnel.component';
import {CommonModule, DatePipe} from "@angular/common";

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormReinitialisationComponent } from './form-reinitialisation/form-reinitialisation.component';
import { PersonnelRequestsComponent } from './personnel-requests/personnel-requests.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { AdminListComponent } from './admin-list/admin-list.component';
import { UpdateAdminComponent } from './update-admin/update-admin.component';

import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AccesDeniedComponent } from './acces-denied/acces-denied.component';
import { ProfileComponent } from './profile/profile.component';
import { EmailAdminComponent } from './email-admin/email-admin.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { AuthorisationInscComponent } from './authorisation-insc/authorisation-insc.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { ListePPRComponent } from './liste-ppr/liste-ppr.component';
import { DateFormatPipe } from './date-format.pipe';




@NgModule({
  declarations: [
    AppComponent,
    AdminTemplateComponent,


    DashboardComponent,
    UsersComponent,
    RequestsComponent,
    LoadUsersComponent,
    LoadRequestsComponent,
    LoginComponent,
    UsersRequestsComponent,
    AddUsersComponent,
    UpdateUserComponent,
    UpdateDemandeComponent,
    PersonnelsListComponent,
    AdminRequestsComponent,
    AddPersonnelComponent,
    UpdatePersonnelComponent,

    ForgotPasswordComponent,
    FormReinitialisationComponent,
    PersonnelRequestsComponent,
    ConfirmDialogComponent,
    AdminListComponent,
    UpdateAdminComponent,

    CreateAdminComponent,
      AccesDeniedComponent,
      ProfileComponent,
      EmailAdminComponent,
      AuthorisationInscComponent,
      ListePPRComponent,
      DateFormatPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    provideAnimationsAsync(),AuthGuard,AuthorizationGuard,DatePipe
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
