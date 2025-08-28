import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PersonnelService} from "../services/personnel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonnelPosition} from "../services/personnel.model";

@Component({
  selector: 'app-update-personnel',
  templateUrl: './update-personnel.component.html',
  styleUrl: './update-personnel.component.css'
})
export class UpdatePersonnelComponent implements OnInit{
  personnelFormGroup!: FormGroup;
  currentPersonnel: any;
  positionOptions: PersonnelPosition[] = Object.values(PersonnelPosition) as PersonnelPosition[];
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private _snackBar: MatSnackBar, private personnelService: PersonnelService, private router: Router,) {
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
    const personnelId = this.route.snapshot.params['id'];
    this.personnelService.getPersonnelById(personnelId).subscribe((personnel: any) => {
      this.currentPersonnel = personnel;
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
    if (this.currentPersonnel) {
      this.personnelFormGroup.patchValue({
        usernamePers: this.currentPersonnel.usernamePers,
        firstName: this.currentPersonnel.firstName ,
        lastName: this.currentPersonnel.lastName ,
        email: this.currentPersonnel.email,
        position: this.currentPersonnel.position,
        dateOfBirth: this.currentPersonnel.dateOfBirth,
        // etc. Remplissez les autres champs du formulaire avec les données de l'utilisateur

        // Nouveaux champs du formulaire
        phoneNumber: this.currentPersonnel.phoneNumber,

      });
    }
  }

  updatePersonnelAction() {
    this.personnelService.updatePersonnel(this.currentPersonnel.id, this.personnelFormGroup.value).subscribe(data =>{
        this.goToPersonnelsList();
        this._snackBar.open('Personnel modifié avec succès!', 'Fermer', {
          duration: 5000, // durée pendant laquelle le snack bar sera affiché (en millisecondes)
        });
      },
      error => console.log(error));
  }
  goToPersonnelsList(){
    this.router.navigate(['/admin/personnelList']);
  }

  cancel() {
    this.router.navigate(['/admin/personnelList']);
  }
}


