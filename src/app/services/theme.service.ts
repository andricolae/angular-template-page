import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');
  theme$ = this.currentTheme.asObservable();
  constructor() {
    this.applyTheme(this.currentTheme.value);
  }
  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    this.currentTheme.next(theme);
    this.applyTheme(theme);
  }
  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
