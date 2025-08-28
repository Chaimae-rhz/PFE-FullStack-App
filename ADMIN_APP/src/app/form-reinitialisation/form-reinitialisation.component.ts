import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form-reinitialisation',
  templateUrl: './form-reinitialisation.component.html',
  styleUrl: './form-reinitialisation.component.css'
})
export class FormReinitialisationComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  private resetToken: string = '';  // Initialize with an empty string
  public hidePassword = true;
  public hideConfirmPassword = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token from URL:', token);  // Debugging
    this.resetToken = token !== null ? token : '';  // Handle null case
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')!.value;  // Use non-null assertion operator
    const confirmPassword = group.get('confirmPassword')!.value;  // Use non-null assertion operator

    return password === confirmPassword ? null : { notMatching: true };
  }

  submitResetPasswordForm(): void {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.value.password;
      console.log('Reset Token:', this.resetToken);  // Debugging
      console.log('New Password:', password);  // Debugging
      this.authService.resetPasswordConfirm(this.resetToken, password).subscribe(
        () => {
          this._snackBar.open('Mot de passe réinitialisé avec succès', 'Fermer', {
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Erreur lors de la réiniting serealisation du mot de passe :', error);
          this._snackBar.open('', 'Fermer', {
            duration: 5000,
          });
        }
      );
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} est requis`;
    } else if (field?.hasError('minlength')) {
      return `${fieldName} doit contenir au moins 6 caractères`;
    } else if (field?.hasError('notMatching')) {
      return `Les mots dze passe ne correspondent pas`;
    }
    return '';
  }

}
