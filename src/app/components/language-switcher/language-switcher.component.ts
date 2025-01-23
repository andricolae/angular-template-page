import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import languageSwitcherConfig from '../../config/language-switcher-config.json';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [MatToolbarModule, CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  config = languageSwitcherConfig;
  languages: { key: string; value: string; enabled: boolean }[] = [];

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    if (this.config.enabled) {
      this.loadLanguages();
    }
  }

  loadLanguages(): void {
    this.languages = this.config.languages.filter((lang) => lang.enabled);
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }
}
