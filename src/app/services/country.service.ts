import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { CityResponse } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryApiUrl = 'https://restcountries.com/v3.1/region/europe';
  private cityApiUrl = 'https://countriesnow.space/api/v0.1/countries/cities';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<any[]>(this.countryApiUrl).pipe(
      map((data) =>
        data?.map((country) => ({
          name: country.name.common,
          code: country.name.common,
        })) || []
      ),
      catchError((error) => {
        console.error('Error loading countries', error);
        return of([]);
      })
    );
  }

  getCities(countryName: string): Observable<string[]> {
    return this.http.post<CityResponse>(this.cityApiUrl, { country: countryName }).pipe(
      map((response) => {
        if (!response || response.error || !Array.isArray(response.data)) {
          throw new Error('Invalid city response format');
        }
        return response.data;
      }),
      catchError((error) => {
        console.error('Error loading cities', error);
        return of([]);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong while fetching data.'));
  }
}
