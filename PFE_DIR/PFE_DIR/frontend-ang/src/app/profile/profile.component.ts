import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../services/user.model";
import { AuthService } from "../services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editing = false;
  passwordVisible = false;
  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      Role: [{ value: '', disabled: true }],
      programeId: ['', Validators.required],
      code: [{ value: '', disabled: true }, Validators.required],
      dateInscription: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    const username = this.authService.getCurrentUser();
    if (username) {
      this.userService.getUserByUsername(username).subscribe(
        (data: User) => {
          this.user = data;
          this.profileForm.patchValue({ ...data, password: '', confirmPassword: '' });
        },
        (error) => {
          console.error('There was an error fetching the user data!', error);
        }
      );
    }
  }

  onEdit(): void {
    this.editing = true;
  }

  onCancel(): void {
    this.editing = false;
    if (this.user) {
      this.profileForm.patchValue({ ...this.user, password: '', confirmPassword: '' });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const formData = this.profileForm.getRawValue(); // getRawValue() to include disabled fields
      this.userService.checkEmailExists(formData.email, this.user.username).subscribe(
        (exists: boolean) => {
          if (exists) {
            this.snackBar.open('Cet email existe déjà', 'Fermer', {
              duration: 3000,
            });
          } else {
            this.userService.updateUserByUsername(this.user!.username, formData).subscribe(
              (updatedUser: User) => {
                this.user = updatedUser;
                this.editing = false;
              },
              (error) => {
                console.error('There was an error updating the user data!', error);
              }
            );
          }
        },
        (error) => {
          console.error('There was an error checking the email!', error);
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
