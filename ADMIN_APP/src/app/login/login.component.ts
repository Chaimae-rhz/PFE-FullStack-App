import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  showPassword: boolean = false;
  loginAttempts: number = 0;
  isBlocked: boolean = false;
  blockDuration: number = 30000; // 30 seconds
  blockTimeout: any;
  blockEndTime: number = 0; // To store the end time of block period

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });

    const blockEndTime = localStorage.getItem('blockEndTime');
    if (blockEndTime) {
      this.blockEndTime = parseInt(blockEndTime, 10);
      const currentTime = new Date().getTime();
      if (currentTime < this.blockEndTime) {
        this.isBlocked = true;
        this.setBlockTimeout(this.blockEndTime - currentTime);
      }
    }
  }

  login() {
    if (this.isBlocked) {
      this.snackBar.open('Vous êtes bloqué. Veuillez réessayer plus tard.', 'Fermer', { duration: 3000 });
      return;
    }

    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe(
      response => {
        this.authService.handleLoginResponse(response);
        this.router.navigateByUrl('/admin/dashboard');
        this.loginAttempts = 0; // Reset attempts on successful login
        localStorage.removeItem('blockEndTime'); // Clear the block state
      },
      error => {
        this.loginAttempts++;
        this.snackBar.open('Échec de la connexion', 'Fermer', { duration: 3000 });

        if (this.loginAttempts >= 3) {
          this.blockUser();
        }
      }
    );
  }

  blockUser() {
    this.isBlocked = true;
    this.blockEndTime = new Date().getTime() + this.blockDuration;
    localStorage.setItem('blockEndTime', this.blockEndTime.toString());
    this.snackBar.open('Trop de tentatives échouées. Vous êtes bloqué pendant 30 secondes.', 'Fermer', { duration: 3000 });

    this.setBlockTimeout(this.blockDuration);
  }

  setBlockTimeout(duration: number) {
    this.blockTimeout = setTimeout(() => {
      this.isBlocked = false;
      this.loginAttempts = 0;
      localStorage.removeItem('blockEndTime');
    }, duration);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    this.router.navigate(['/forgotPassword']);
  }
}
