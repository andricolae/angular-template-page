import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private authStateService: AuthStateService) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.isLoading = true;
      this.authService.login(email, password).subscribe({
        next: (resData) => {
          console.log('Logged in:', resData);
          this.isLoading = false;
          this.authStateService.updateUsername(email);
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
    }
    else {
      this.isLoading = true;
      this.authService.signup(email, password).subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading = false;
          this.isLoginMode = !this.isLoginMode;
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
    }
    form.reset();
  }
  clearMessages() {
    this.error = null;
    this.successMessage = null;
  }
  onForgotPassword(emailInput: HTMLInputElement) {
    const email = emailInput.value;
    if (!email) {
      this.error = "Please enter your email.";
      return;
    }
    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.successMessage = "Email sent! Check your inbox.";
        this.error = null;
      },
      error: (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
      }
    });
  }
}
