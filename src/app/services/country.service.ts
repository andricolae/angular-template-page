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
  private cacheDuration = 30 * 24 * 60 * 60 * 1000;

  constructor(private http: HttpClient) {}

  private saveToCache(key: string, data: any): void {
    const item = {
      data,
      expiry: Date.now() + this.cacheDuration,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  private loadFromCache<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsedItem = JSON.parse(item);
    if (Date.now() > parsedItem.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return parsedItem.data;
  }

  getCountries(): Observable<Country[]> {
    const cachedData = this.loadFromCache<Country[]>('cachedCountries');
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<any[]>(this.countryApiUrl).pipe(
      map((data) => {
        const countries = data?.map((country) => ({
          name: country.name.common,
          code: country.name.common,
        })) || [];
        this.saveToCache('cachedCountries', countries);
        return countries;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
  getCities(countryName: string): Observable<CityResponse> {
    const cacheKey = `cachedCities_${countryName}`;
    const cachedData = this.loadFromCache<CityResponse>(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.post<CityResponse>(this.cityApiUrl, { country: countryName }).pipe(
      map((response) => {
        if (!response || response.error || !Array.isArray(response.data)) {
          throw new Error(response.msg || 'Invalid city response format');
        }
        this.saveToCache(cacheKey, response);
        return response;
      }),
      catchError((error) => {
        return of({ error: true, msg: 'Failed to load cities.', data: [] });
      })
    );
  }

  private handleError(error: any): Observable<never> {
    return throwError(() => new Error('Something went wrong while fetching data.'));
  }
}
