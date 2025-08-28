import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserRole} from "../services/user.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../services/admin.service";

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html',
  styleUrl: './update-admin.component.css'
})
export class UpdateAdminComponent  implements  OnInit{
  adminFormGroup! : FormGroup;

  currentAdmin: any;
  emailExistsError: string = '';

  constructor(private fb : FormBuilder ,private _snackBar: MatSnackBar, private adminService: AdminService, private route: ActivatedRoute, private router :Router) {

  }



  ngOnInit() {
    this.adminFormGroup=this.fb.group({

      email: [null, [Validators.required, Validators.email]],
      password : this.fb.control(null,[Validators.required,Validators.minLength(8)]),
      superAdmin: this.fb.control(null),


    });
    const adminId = this.route.snapshot.params['id'];
    this.adminService.getAdminById(adminId).subscribe((admin: any) => {
      this.currentAdmin = admin;
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
    if (this.currentAdmin) {
      this.adminFormGroup.patchValue({

        email: this.currentAdmin.email,
        password : this.currentAdmin.password,

        superAdmin : this.currentAdmin.superAdmin|| null,

      });
    }
  }
  updateAdminAction() {
    const newEmail = this.adminFormGroup.value.email;

    // Vérifier si l'email existe déjà
    this.adminService.checkEmailExists(newEmail, this.currentAdmin.id).subscribe(
      emailExists => {
        if (emailExists) {
          this.emailExistsError = 'Ce email existe déjà.';
        } else {
          this.adminService.updateAdmin(this.currentAdmin.id, this.adminFormGroup.value).subscribe(
            data => {
              this.goToAdminsList();
              this._snackBar.open('Utilisateur modifié avec succès!', 'Fermer', {
                duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
              });
            },
            error => {
              console.log(error);
              this._snackBar.open('Une erreur s\'est produite. Veuillez réessayer.', 'Fermer', {
                duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
              });
            }
          );
        }
      },
      error => {
        console.log(error);
        this._snackBar.open('Une erreur s\'est produite lors de la vérification de l\'email. Veuillez réessayer.', 'Fermer', {
          duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
        });
      }
    );
  }
  goToAdminsList(){
    this.router.navigate(['/admin/listeAdmin']);
  }

  cancel() {
    this.router.navigate(['/admin/listeAdmin']);
  }

}


