import {Component, OnInit} from '@angular/core';
import {UserDTO, UserRole} from "../services/user.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Personnel, PersonnelPosition} from "../services/personnel.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {PersonnelService} from "../services/personnel.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrl: './add-personnel.component.css'
})
export class AddPersonnelComponent implements OnInit {
  positionOptions: PersonnelPosition[] = Object.values(PersonnelPosition) as PersonnelPosition[];

  personnelFormGroup!: FormGroup;
  personnel: Personnel = new Personnel();
  emailExistsError: string = '';

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private personnelService: PersonnelService, private router: Router,) {
  }
  ngOnInit() {
    this.personnelFormGroup=this.fb.group({
      usernamePers : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      email: [null, [Validators.required, Validators.email]],
      firstName : this.fb.control(null,[Validators.required]),
      lastName : this.fb.control(null,[Validators.required]),
      position : this.fb.control(null,[Validators.required]),
      phoneNumber: [null, [Validators.required]],
      dateOfBirth:[null, [Validators.required]]
    });
  }

  saveUser() {
    const currentDate = new Date();

    const personnel: Personnel = {
      usernamePers: this.personnelFormGroup.value.usernamePers,
      email: this.personnelFormGroup.value.email,
      firstName: this.personnelFormGroup.value.firstName,
      lastName: this.personnelFormGroup.value.lastName,
      position: this.personnelFormGroup.value.position,
      hireDate: currentDate,
      phoneNumber:this.personnelFormGroup.value.phoneNumber,
      dateOfBirth: this.personnelFormGroup.value.dateOfBirth,
    };
    const requestBody = JSON.stringify(personnel);
    this.personnelService.addPersonnel(personnel).subscribe(
      data => {
        console.log(data);
        this.goToPersonnels();
        this._snackBar.open('Personnel ajouté avec succès!', 'Fermer', {
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

  handlePersonnel() {
    console.log(this.personnelFormGroup.value);
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
    this.router.navigate(['/admin/personnelList']);
  }
  goToPersonnels(){
    this.router.navigate(['/admin/personnelList']);
  }

}
