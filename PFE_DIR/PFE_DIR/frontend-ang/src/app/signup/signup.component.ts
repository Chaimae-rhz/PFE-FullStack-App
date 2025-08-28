import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDTO, UserRole } from '../services/signup.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  roleOptions: UserRole[] = Object.values(UserRole);
  userFormGroup!: FormGroup;
  verifyFormGroup!: FormGroup;
  isVerified: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;

  failureCount: number = 0;
  isLocked: boolean = false;
  lockDuration: number = 30; // Durée du verrouillage en secondes
  countdownTimer: any;

  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.verifyFormGroup = this.fb.group({
      ppr: [null, [Validators.required]],
      dateNaissance: [null, [Validators.required]]
    });

    this.userFormGroup = this.fb.group({
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      firstName: [null, [Validators.required, Validators.minLength(4)]],
      username: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, this.confirmPasswordValidator]],
      role: [null, [Validators.required]],
      programId: [null, [Validators.required]],
      code: [{value: null, disabled: true}, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

    // Charger l'état de verrouillage depuis le localStorage
    this.loadLockState();
  }

  handleVerification() {
    if (this.isLocked) {
      return;
    }

    const ppr = this.verifyFormGroup.get('ppr')?.value;
    const dateNaissance = this.formatDate(this.verifyFormGroup.get('dateNaissance')?.value);

    if (this.hasAccountBeenCreated(ppr)) {
      this.errorMessage = 'Un compte a déjà été créé pour cet utilisateur.';
      return;
    }

    this.signupService.verifyPersonne(ppr, dateNaissance).subscribe(
      (exists) => {
        if (exists) {
          this.isVerified = true;
          this.userFormGroup.get('code')?.setValue(ppr.toString());
          this.userFormGroup.get('code')?.disable();
          this.failureCount = 0; // Réinitialiser le compteur en cas de succès
          this.clearLockState(); // Effacer l'état de verrouillage en cas de succès
        } else {
          this.failureCount++;
          this.errorMessage = 'Informations incorrectes. Veuillez réessayer.';
          if (this.failureCount >= 3) {
            this.lockForm();
          }
        }
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  lockForm() {
    this.isLocked = true;
    const unlockTime = new Date().getTime() + this.lockDuration * 1000;
    this.saveLockState(this.isLocked, unlockTime);
    this.startCountdown();
    setTimeout(() => {
      this.isLocked = false;
      this.failureCount = 0;
      this.errorMessage = '';
      this.clearLockState();
    }, this.lockDuration * 1000);
  }

  startCountdown() {
    let timeLeft = this.lockDuration;
    this.countdownTimer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(this.countdownTimer);
        this.errorMessage = '';
      } else {
        timeLeft--;
        this.errorMessage = `Formulaire verrouillé. Réessayez dans ${timeLeft} secondes.`;
      }
    }, 1000);
  }

  private saveLockState(lockState: boolean, unlockTime: number) {
    localStorage.setItem('isLocked', JSON.stringify(lockState));
    localStorage.setItem('unlockTime', JSON.stringify(unlockTime));
  }

  private loadLockState() {
    const lockState = localStorage.getItem('isLocked');
    const unlockTime = localStorage.getItem('unlockTime');
    if (lockState && unlockTime) {
      this.isLocked = JSON.parse(lockState);
      const unlockTimeValue = JSON.parse(unlockTime);
      const currentTime = new Date().getTime();
      const remainingTime = unlockTimeValue - currentTime;
      if (remainingTime > 0) {
        this.lockDuration = Math.ceil(remainingTime / 1000);
        this.startCountdown();
      } else {
        this.clearLockState();
      }
    }
  }

  private clearLockState() {
    localStorage.removeItem('isLocked');
    localStorage.removeItem('unlockTime');
  }



  saveUser() {
    if (this.userFormGroup.valid) {
      const dateInscription = new Date();
      const password = this.userFormGroup.get('password')?.value;
      const confirmPassword = this.userFormGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        this.userFormGroup.get('confirmPassword')?.setErrors({ notMatch: true });
        return;
      }

      const userDTO: UserDTO = {
        lastName: this.userFormGroup.value.lastName,
        firstName: this.userFormGroup.value.firstName,
        username: this.userFormGroup.value.username,
        email: this.userFormGroup.value.email,
        password: password,
        role: this.userFormGroup.value.role,
        dateInscription: dateInscription,
        programeId: this.userFormGroup.value.programId,
        code: this.userFormGroup.value.code,
        phoneNumber: this.userFormGroup.value.phoneNumber
      };

      this.signupService.addUserAndLogin(userDTO).subscribe(
        (data) => {
          console.log(data);
          this.saveAccountCreationState(userDTO.code); // Sauvegarder l'état de création du compte
          this.router.navigate(['/user/home']);
        },
        (error) => {
          if (error === 'this username exists') {
            this.userFormGroup.get('username')?.setErrors({ usernameExists: true });
          }
          else if (error === 'this email exists') {
            this.userFormGroup.get('email')?.setErrors({ emailExists: true });
          }else {
            console.error(error);
          }
        }
      );
    } else {
      this.userFormGroup.markAllAsTouched();
    }
  }

  handleUser() {
    console.log(this.userFormGroup.value);
    this.saveUser();
  }

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']) {
      return fieldName + ' is required';
    } else if (error['minlength']) {
      return fieldName + ' should have at least ' + error['minlength']['requiredLength'] + ' characters';
    } else if (error['email']) {
      return 'Invalid ' + fieldName;
    } else if (error['pattern']) {
      return 'Invalid format for ' + fieldName;
    } else if (error['notMatch']) {
      return 'Passwords do not match';
    } else {
      return '';
    }
  }

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { notMatch: true } : null;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: any) {
    const inputDate = event.value;
    this.verifyFormGroup.get('dateNaissance')?.setValue(inputDate);
  }

  private saveAccountCreationState(ppr: string) {
    localStorage.setItem('accountCreatedFor', ppr);
  }

  private hasAccountBeenCreated(ppr: string): boolean {
    const accountCreatedFor = localStorage.getItem('accountCreatedFor');
    return accountCreatedFor === ppr;
  }

}
