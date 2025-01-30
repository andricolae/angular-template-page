import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import languageSwitcherConfig from '../../config/language-switcher-config.json';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [MatToolbarModule, CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  config = languageSwitcherConfig;
  languages: { key: string; value: string; enabled: boolean }[] = [];

  ngOnInit(): void {
    if (this.config.enabled) {
      this.loadLanguages();
    }
  }

  loadLanguages(): void {
    this.languages = this.config.languages.filter((lang) => lang.enabled);
  }

  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);

  translateText(lang: string) {
    this.translate.use(lang);
    this.languageService.changeLanguage(lang);
  }

  onLanguageChange(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.translateText(selectedLanguage);
  }
}
