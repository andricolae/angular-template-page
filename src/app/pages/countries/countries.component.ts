import { Component, inject, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { HighlightService } from '../../services/highlight.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-countries',
  imports: [TranslateModule, NgxSpinnerModule, FormsModule, SpinnerComponent, ErrorComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {
  @ViewChild(SpinnerComponent) spinner!: SpinnerComponent;
  countries: any[] = [];
  cities: any[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  errorMessage: string = '';
  showErrorNotification: boolean = false;

  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  constructor(private highlightService: HighlightService, private http: HttpClient) { }

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
    // this.spinner.show();
    this.http.get<any[]>('https://restcountries.com/v3.1/region/europe')
      .pipe(
        map(data => data?.map(country => ({
          name: country.name.common,
          code: country.name.common
        })) || []),
        catchError((error: any) => {
          console.error('Error loading countries', error);
          // this.handleError('Failed to load countries. Please check your connection and try again.');
          this.errorMessage = 'Failed to load countries. Please check your connection and try again.';
          this.showErrorNotification = true;
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.countries = data;
          this.showErrorNotification = false;
        } else {
          this.errorMessage = 'No countries found. Please try again later.';
          this.showErrorNotification = true;
        }
      });
  }

  onCountryChange(): void {
    if (!this.selectedCountry) return;
    this.spinner.show();
    this.http.post<any>('https://countriesnow.space/api/v0.1/countries/cities', { country: this.selectedCountry })
      .pipe(
        map(response => response?.data || []),
        catchError(error => {
          console.error('Error loading cities', error);
          this.errorMessage = 'Failed to load cities. Please check your connection and try again.';
          this.showErrorNotification = true;
          return of([]);
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.cities = data;
          this.showErrorNotification = false;
        } else {
          this.errorMessage = 'No cities found for this country. Please try another selection.';
          this.showErrorNotification = true;
        }
      });
  }

  handleError(message: string): void {
    console.error('Displaying error:', message);
    // this.errorMessage = message;
    // this.showErrorNotification = true;
  }

  resetSelections() {
    this.selectedCountry = '';
    this.cities = [];
  }
}
