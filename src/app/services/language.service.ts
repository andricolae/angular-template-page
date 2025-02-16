import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSource = new BehaviorSubject<string>(localStorage.getItem('language') || 'en');
  currentLanguage = this.languageSource.asObservable();

  constructor(private translate: TranslateService) {}

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.languageSource.next(lang);
    localStorage.setItem('language', lang);
  }
}
