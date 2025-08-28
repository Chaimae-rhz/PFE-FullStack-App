import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserDTO, UserRole} from "../services/user.model";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UpdateUserModel} from "../services/updateUser.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements  OnInit{
  userFormGroup! : FormGroup;
  roleOptions: UserRole[] = Object.values(UserRole);
  currentUser: any;

  updateError: string = '';
  constructor(private fb : FormBuilder ,private _snackBar: MatSnackBar, private userService: UserService, private route: ActivatedRoute, private router :Router) {

  }



  ngOnInit() {
    this.userFormGroup=this.fb.group({
      username : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      firstName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      lastName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      email: [null, [Validators.required, Validators.email]],
      password : this.fb.control(null,[Validators.required,Validators.minLength(8)]),
      role : this.fb.control(null,[Validators.required]),
      recoFaciale: this.fb.control(null), // Ajoutez cette ligne pour le contrôle 'faceID'
      programeId: this.fb.control(null), // Ajoutez cette ligne pour le contrôle 'programeId'
      code: this.fb.control(null),
      phoneNumber:this.fb.control(null)

    });
    const userId = this.route.snapshot.params['id'];
    this.userService.getUserById(userId).subscribe((user: any) => {
      this.currentUser = user;
      this.populateFormWithUserData();

    });
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


  populateFormWithUserData() {
    if (this.currentUser) {
      this.userFormGroup.patchValue({
        username: this.currentUser.username,
        firstName: this.currentUser.firstName || null,
        lastName: this.currentUser.lastName|| null ,
        email: this.currentUser.email,
        password : this.currentUser.password,
        role: this.currentUser.role,
        // etc. Remplissez les autres champs du formulaire avec les données de l'utilisateur

        // Nouveaux champs du formulaire
        programeId: this.currentUser.programeId || null,
        recoFaciale : this.currentUser.recoFaciale || null,
        code: this.currentUser.code || null,
        phoneNumber :this.currentUser.phoneNumber
      });
    }
  }

  updateUserAction() {
    this.userService.updateUser(this.currentUser.id, this.userFormGroup.value).subscribe(data => {
        this.goToUsersList();
        this._snackBar.open('Utilisateur modifié avec succès!', 'Fermer', {
          duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.updateError = error.error;
        } else {
          this._snackBar.open('Une erreur s\'est produite. Veuillez réessayer.', 'Fermer', {
            duration: 5000,
          });
        }
      });
  }
  goToUsersList(){
    this.router.navigate(['/admin/users']);
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }

}
