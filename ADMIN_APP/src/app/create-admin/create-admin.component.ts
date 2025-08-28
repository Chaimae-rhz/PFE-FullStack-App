import {Component, OnInit} from '@angular/core';
import {UserDTO, UserRole} from "../services/user.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {AdminService} from "../services/admin.service";
import {Admin} from "../services/admin.model";

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css'
})
export class CreateAdminComponent implements  OnInit{

  adminFormGroup! : FormGroup;
  admin: Admin= new Admin();
  emailExistsError: string = '';

  constructor(private fb : FormBuilder,private _snackBar: MatSnackBar,private adminService:AdminService, private  router :Router, ) {
  }
  saveAdmin() {


    const admin: Admin = {
      id:this.adminFormGroup.value.id,
      email: this.adminFormGroup.value.email,
      password: this.adminFormGroup.value.password,
      superAdmin:this.adminFormGroup.value.superAdmin,


    };
    const requestBody = JSON.stringify(admin);
    this.adminService.createAdmin(admin).subscribe(
      data => {
        console.log(data);
        this.goToAdmins();
        this._snackBar.open('Utilisateur ajouté avec succès!', 'Fermer', {
          duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
        });
      },
      error => {
        if (error instanceof HttpErrorResponse && error.status === 409) {
          this.emailExistsError = error.error;
        }
      }
    );
  }
  goToAdmins(){
    this.router.navigate(['/admin/listeAdmin']);
  }


  ngOnInit() {
    this.adminFormGroup=this.fb.group({

      email: [null, [Validators.required, Validators.email]],
      password : this.fb.control(null,[Validators.required,Validators.minLength(8)]),
      superAdmin : this.fb.control(null),

    });
  }

  handleAdmin() {
    console.log(this.adminFormGroup.value);
    this.saveAdmin();
  }


  getErrorMessage(fieldName: string, error: ValidationErrors ) {
    if(error['required']){
      return fieldName + " is required";
    } else if(error['minlength']){
      return  fieldName + " should have at least " +error['minlength']['requiredLength']+" Characters";
    } else if(error['email']){
      return "Invald " + fieldName;
    }else return "";
  }

  cancel() {
    this.router.navigate(['/admin/listeAdmin']);
  }

}



