import { Component, inject } from '@angular/core';
import { HighlightService } from '../../services/highlight.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact',
  imports: [TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  constructor(private highlightService: HighlightService) {}

  ngOnInit() {
    this.highlightService.highlightedHeader$.subscribe((headerId) => {
      if (headerId) {
        document.querySelectorAll('h1, h2, h3').forEach((el) => el.classList.remove('highlight'));
        const header = document.getElementById(headerId);
        if (header) {
          header.classList.add('highlight');
        }
      }
    });
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
  }
}
