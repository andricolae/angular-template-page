import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-preferences',
  imports: [FormsModule, CommonModule, SpinnerComponent, ErrorComponent],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  @ViewChild(SpinnerComponent) spinner!: SpinnerComponent;

  availableLanguages: { label: string; code: string }[] = [];
  selectedLanguage: string = 'en';
  selectedTheme: string = 'light';
  userId: string | null = null;
  errorMessage: string = '';
  showErrorNotification: boolean = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private themeService: ThemeService
  ) {}

  async ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadUserPreferences(user.id);
      }
    });
    this.themeService.theme$.subscribe(theme => {
      this.selectedTheme = theme;
    });
  }
  async loadUserPreferences(userId: string) {
    try {
      const userProfile = await this.databaseService.getUserProfile(userId).toPromise();
      if (userProfile) {
        this.selectedLanguage = userProfile.language || 'en';
        this.selectedTheme = userProfile.theme || 'light';
        this.themeService.setTheme(this.selectedTheme);
      }
    } catch (error) {
      this.showError('Eroare');
    }
  }
  async savePreferences() {
    if (!this.userId) return;
    if (!navigator.onLine) {
      this.showError('Eroare');
      return;
    }
    this.spinner.show();
    this.errorMessage = '';
    try {
      await this.databaseService.updateUserTheme(this.userId, this.selectedTheme).toPromise();
      localStorage.setItem('theme', this.selectedTheme);
      document.documentElement.setAttribute('data-theme', this.selectedTheme);
      this.showError('Succes');
    } catch (error) {
      this.showError('Eroare');
    } finally {
      this.spinner.hide();
    }
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorNotification = true;
    setTimeout(() => {
      this.showErrorNotification = false;
    }, 2000);
  }
}
