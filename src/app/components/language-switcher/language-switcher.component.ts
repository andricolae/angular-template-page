import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { languageSwitcherConfig } from '../../config/language-switcher-config';
import languagesData from '../../config/languages.json'; // Import the JSON file
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  imports: [MatToolbarModule, CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  config = languageSwitcherConfig;
  languages: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.config.enabled) {
      this.loadLanguages();
    }
  }

  loadLanguages(): void {
    this.languages = languagesData.languages;
  }
}
