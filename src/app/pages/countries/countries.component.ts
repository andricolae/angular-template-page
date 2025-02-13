import { Component, inject, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { HighlightService } from '../../services/highlight.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ErrorComponent } from '../../components/error/error.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';
import { CityResponse } from '../../models/city.model';

@Component({
  selector: 'app-countries',
  imports: [TranslateModule, NgxSpinnerModule, FormsModule, SpinnerComponent, ErrorComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {
  @ViewChild(SpinnerComponent) spinner!: SpinnerComponent;
  continents: { name: string }[] = [];
  countries: Country[] = [];
  cities: string[] = [];
  selectedContinent: string = '';
  selectedCountry: string = '';
  selectedCity: string = '';
  errorMessage: string = '';
  showErrorNotification: boolean = false;

  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);
  constructor(private highlightService: HighlightService, private http: HttpClient, private countryService: CountryService) { }

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
    this.fetchContinents();
  }

  fetchContinents() {
    this.countryService.getContinents().subscribe({
      next: (data) => {
        this.continents = data;
      },
      error: () => {
        this.showError("Failed to load continents.");
      },
    });
  }

  onContinentSelect(continentName: string) {
    this.selectedContinent = continentName;
    this.selectedCountry = '';
    this.cities = [];
    this.fetchCountries(continentName);
  }

  fetchCountries(continentName: string) {
    if (!continentName) return;

    this.spinner.show();

    this.countryService.getCountries(continentName).subscribe({
      next: (data) => {
        this.countries = data;
        this.showErrorNotification = false;
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: () => {
        this.showError("No countries found. A network error has occurred!");
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
    });
  }

  fetchCities() {
    if (!this.selectedCountry) return;

    this.spinner.show();

    this.countryService.getCities(this.selectedCountry).subscribe({
      next: (response: CityResponse) => {
        if (response.error) {
          this.showError(response.msg);
        } else {
          this.cities = response.data;
          this.showErrorNotification = false;
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.showError("A network error has occurred! Try again later.");
      },
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorNotification = true;
  }

  resetSelections() {
    this.selectedContinent = '';
    this.countries = [];
    this.selectedCountry = '';
    this.cities = [];
    this.showErrorNotification = false;
  }
}
