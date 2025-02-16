import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  languageService: LanguageService = inject(LanguageService);
  translate: TranslateService = inject(TranslateService);

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
    this.translate.use(this.getLanguage());
  }

  goHome() {
    this.router.navigate(['/']);
  }

  getLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }
}
