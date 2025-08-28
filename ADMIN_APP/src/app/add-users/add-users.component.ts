import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {UserDTO, UserRole} from "../services/user.model";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";




@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent implements  OnInit{
  roleOptions: UserRole[] = Object.values(UserRole);
  userFormGroup! : FormGroup;
  user : UserDTO= new UserDTO();
  emailExistsError: string = '';

  constructor(private fb : FormBuilder,private _snackBar: MatSnackBar,private userService: UserService, private  router :Router, ) {
  }
  saveUser() {
    const currentDate = new Date();

    const userDTO: UserDTO = {
      username: this.userFormGroup.value.username,
      email: this.userFormGroup.value.email,
      password: this.userFormGroup.value.password,
      role: this.userFormGroup.value.role,
      dateInscription: currentDate,
      phoneNumber:this.userFormGroup.value.phoneNumber,
      programeId:this.userFormGroup.value.programeId
    };
    const requestBody = JSON.stringify(userDTO);
    this.userService.addUsers(userDTO).subscribe(
      data => {
        console.log(data);
        this.goToUsers();
        this._snackBar.open('Utilisateur ajouté avec succès!', 'Fermer', {
          duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.emailExistsError = error.error;
        } else {
          this._snackBar.open('Une erreur s\'est produite. Veuillez réessayer.', 'Fermer', {
            duration: 5000,
          });
        }
      }
    );
  }
  goToUsers(){
    this.router.navigate(['/admin/users']);
  }


  ngOnInit() {
    this.userFormGroup=this.fb.group({
       username : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      email: [null, [Validators.required, Validators.email]],
      password : this.fb.control(null,[Validators.required,Validators.minLength(8)]),
      role : this.fb.control(null,[Validators.required]),
      phoneNumber : this.fb.control(null,[Validators.required]),
    });
  }

  handleUser() {
    console.log(this.userFormGroup.value);
    this.saveUser();
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
    this.router.navigate(['/admin/users']);
  }

}




