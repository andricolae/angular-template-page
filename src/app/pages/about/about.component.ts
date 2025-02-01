import { Component, inject } from '@angular/core';
import { HighlightService } from '../../services/highlight.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, map, of } from 'rxjs';

@Component({
  selector: 'app-about',
  imports: [TranslateModule, NgxSpinnerModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: string = '';
  errorMessage: string = '';
  showErrorNotification: boolean = false;

  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  constructor(private highlightService: HighlightService, private spinner: NgxSpinnerService, private http: HttpClient) { }

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
    this.loadCountries();
  }

  loadCountries(): void {
    this.spinner.show();
    this.http.get<any[]>('https://restcountries.com/v3.1/region/europe')
      .pipe(
        map(data => data?.map(country => ({
          name: country.name.common,
          code: country.name.common
        })) || []),
        catchError(error => {
          console.error('Error loading countries', error);
          this.handleError('Failed to load countries. Please check your connection and try again.');
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.countries = data;
          this.errorMessage = '';
          this.showErrorNotification = false;
        } else {
          this.handleError('No countries found. Please try again later.');
        }
      });
  }

  onCountryChange(): void {
    if (!this.selectedCountry) return;
    this.spinner.show();
    this.http.post<any>('https://countriesnow.space/api/v01/countries/cities', { country: this.selectedCountry })
      .pipe(
        map(response => response?.data || []),
        catchError(error => {
          console.error('Error loading cities', error);
          this.handleError('Failed to load cities. Please check your connection and try again.');
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.cities = data;
          this.errorMessage = '';
          this.showErrorNotification = false;
        } else {
          this.handleError('No cities found for this country. Please try another selection.');
        }
      });
  }

  handleError(message: string): void {
    console.error('Displaying error:', message);
    this.errorMessage = message;
    this.showErrorNotification = true;
  }

}
