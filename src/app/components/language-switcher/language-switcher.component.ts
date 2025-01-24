import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import languageSwitcherConfig from '../../config/language-switcher-config.json';
import { CommonModule } from '@angular/common';

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
}
