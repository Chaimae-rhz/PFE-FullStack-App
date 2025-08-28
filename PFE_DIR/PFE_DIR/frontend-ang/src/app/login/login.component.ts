import {Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {MatDialog} from "@angular/material/dialog";
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  countdown: number = 0;
  isLocked: boolean = false;
  shakeButton: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const startTime = localStorage.getItem('countdown_start');
    if (startTime) {
      const elapsedSeconds = Math.floor((new Date().getTime() - parseInt(startTime, 10)) / 1000);
      if (elapsedSeconds < 30) {
        this.startCountdown(30 - elapsedSeconds);
      } else {
        this.isLocked = false;
      }
    }
  }

  login() {
    if (this.isLocked) {
      return;
    }

    if (this.loginForm.valid) {
      const bodyData = this.loginForm.value;
      this.http.post("http://172.30.70.16:8082/login", bodyData).subscribe((resultData: any) => {
        console.log(resultData);
        if (resultData.message == "username not exists") {
          this.snackBar.open("Nom d'utilisateur inexistant", "Close", {
            duration: 3000,
          });
          this.triggerShakeAnimation(); // Ajoutez cette ligne
          this.authService.failedAttempts++;
          if (this.authService.failedAttempts >= 3) {
            this.startCountdown(30);
          }
        } else if (resultData.message == "Login Success") {
          this.authService.login(bodyData.username);
          this.router.navigateByUrl('/user/home');
        } else {
          this.snackBar.open("Nom d'utilisateur ou mot de passe incorrect", "Close", {
            duration: 3000,
          });
          this.triggerShakeAnimation(); // Ajoutez cette ligne
          this.authService.failedAttempts++;
          if (this.authService.failedAttempts >= 3) {
            this.startCountdown(30);
          }
        }
      });
    } else {
      this.snackBar.open("Veuillez remplir tous les champs", "Close", {
        duration: 3000,
      });
    }
  }

  triggerShakeAnimation() {
    this.shakeButton = true;
    setTimeout(() => {
      this.shakeButton = false;
    }, 1000);
  }


  startCountdown(seconds: number) {
    this.isLocked = true;
    this.countdown = seconds;
    localStorage.setItem('countdown_start', new Date().getTime().toString());

    const countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(countdownInterval);
        this.isLocked = false;
        this.authService.failedAttempts = 0;
        localStorage.removeItem('countdown_start');
      }
    }, 1000);
  }

  openForgotPasswordDialog() {
    this.dialog.open(ForgotPasswordDialogComponent);
  }

}

