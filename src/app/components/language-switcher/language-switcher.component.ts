import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import languageSwitcherConfig from '../../config/language-switcher-config.json';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-switcher',
  imports: [MatToolbarModule, CommonModule, FormsModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  config = languageSwitcherConfig;
  languages: { key: string; value: string; enabled: boolean }[] = [];
  currentLanguage: string = 'en';
  private languageSubscription!: Subscription;

  constructor(private translate: TranslateService, private languageService: LanguageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.config.enabled) {
      this.loadLanguages();
      this.languageSubscription = this.languageService.currentLanguage.subscribe(lang => {
        this.currentLanguage = lang;
      });
      this.cdr.detectChanges();
    }
    console.log(this.currentLanguage);
  }

  loadLanguages(): void {
    this.languages = this.config.languages.filter((lang) => lang.enabled);
  }

  translateText(lang: string) {
    this.translate.use(lang);
    this.languageService.changeLanguage(lang);
  }

  onLanguageChange(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.translateText(selectedLanguage);
  }
}
