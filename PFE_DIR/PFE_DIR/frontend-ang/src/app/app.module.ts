import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserTemplateComponent } from './user-template/user-template.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {MatList, MatListItem} from "@angular/material/list";
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AddRequestComponent } from './add-request/add-request.component';
import { RequestsCompletedComponent } from './requests-completed/requests-completed.component';
import { CurrentRequestsComponent } from './current-requests/current-requests.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http'; // Importez ceci
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./guards/auth.guard";
import {MatOption, MatSelect} from "@angular/material/select";
import { SignupComponent } from './signup/signup.component';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';
import {MaintenanceComponent} from "./maintenance/maintenance.component";

@NgModule({
  declarations: [
    AppComponent,
    UserTemplateComponent,
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    AddRequestComponent,
    RequestsCompletedComponent,
    CurrentRequestsComponent,
    DashboardComponent,
    SignupComponent,
    ForgotPasswordDialogComponent,
    MaintenanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDrawerContainer,
    MatList,
    MatListItem,
    MatDrawer,
    MatDrawerContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatDivider,
    MatFormField,
    MatInputModule,
    MatCardActions,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSelect,
    MatOption,
    MatProgressSpinner,
    MatSnackBarModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatNativeDateModule

    // Ajoutez ceci aux imports
  ],
  providers: [
    provideAnimationsAsync() ,AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
