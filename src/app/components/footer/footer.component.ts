import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import footerConfig from '../../config/footer-config.json';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatToolbarModule, CommonModule, TranslateModule],
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  config: { enabled: boolean; sticky: boolean } = footerConfig;

  ngOnInit(): void {
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
  }

  get isEnabled() {
    return this.config.enabled;
  }

  get isSticky() {
    return this.config.sticky;
  }
}
