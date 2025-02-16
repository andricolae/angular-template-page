import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorComponent } from '../components/error/error.component';
import { ThemeService } from '../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { DatabaseService } from '../services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule, ErrorComponent, TranslateModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = '';
  showErrorNotification: boolean = false;
  theme: string = 'light';
  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  private languageSub!: Subscription;
  userLanguage: string | undefined;

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
    this.languageSub = this.authService.languageSubject.subscribe((language) => {
      this.userLanguage = language;
      console.log("User's language in AuthComponent:", this.userLanguage);
      this.languageService.changeLanguage(language);
      this.translate.use(language);
    });
  }

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
    const language = navigator.language.slice(0, 2);
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    console.log("Detected theme:", theme);
    console.log("Detected language:", language);

    if (this.isLoginMode) {
      this.isLoading = true;
      this.authService.login(email, password).subscribe({
        next: (resData) => {
          console.log('Logged in:', resData);
          // console.log(resData.email);
          this.isLoading = false;
          // this.databaseService.getUserLanguage(resData.idToken).subscribe((language) => {
          //   console.log("User language:", language);
          // language = "ro";
          //   this.languageService.changeLanguage(language);
          //   this.translate.use(language);
          // });
          this.router.navigate(['/countries']);
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.errorMessage = errorMessage;
          this.showError(this.errorMessage);
          this.isLoading = false;
        }
      });
    }
    else {
      this.isLoading = true;
      this.authService.signup(email, password, language).subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading = false;
          this.isLoginMode = !this.isLoginMode;
          this.errorMessage = "Verification email sent! Please check your inbox.";
          this.showError(this.errorMessage);
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.errorMessage = errorMessage;
          this.showError(this.errorMessage);
          this.isLoading = false;
        }
      });
    }
    form.reset();
  }

  clearMessages() {
    this.errorMessage = '';
    this.showErrorNotification = false;
  }

  onForgotPassword(emailInput: HTMLInputElement) {
    const email = emailInput.value;
    if (!email) {
      this.errorMessage = "Please enter your email.";
      this.showError(this.errorMessage);
      return;
    }
    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.errorMessage = "Password reset email sent! Check your inbox.";
        this.showError(this.errorMessage);
      },
      error: (errorMessage) => {
        console.log(errorMessage);
        this.showError(errorMessage);
      }
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorNotification = true;
  }
}
