import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit {
  profileForm: FormGroup;
  public hidePassword = true;
  private adminData: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.currentAdminId) {
      if (this.adminData) { // Check if admin data is already loaded
        this.profileForm.patchValue(this.adminData); // Use cached admin data
      } else {
        this.authService.getAdminProfile().subscribe(admin => {
          this.adminData = admin;
          this.profileForm.patchValue(admin); // Update form with admin data
        }, error => {
          console.error('Error fetching admin profile:', error);
        });
      }
    } else {
      console.error('Admin ID is not set.');
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.authService.updateAdminProfile(this.profileForm.value).subscribe(() => {
        this.adminData = { ...this.profileForm.value };
        this.router.navigate(['/admin/dashboard']);

      }, error => {
        console.error('Error updating profile:', error);
      });
    }
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}



