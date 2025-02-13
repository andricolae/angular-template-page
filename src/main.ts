/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptorService } from './app/services/auth-intercept.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const firebaseConfig = {
  apiKey: "AIzaSyBqsg5CZVBbhGSl0p9KrQ_Z5xZGyAFQ44A",
  authDomain: "angular-template-page.firebaseapp.com",
  databaseURL: "https://angular-template-page-default-rtdb.firebaseio.com",
  projectId: "angular-template-page",
  storageBucket: "angular-template-page.firebasestorage.app",
  messagingSenderId: "627149628663",
  appId: "1:627149628663:web:c851cbddfd87d255999ff2",
  measurementId: "G-P9WTSN3HWH"
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        },
        defaultLanguage: 'en',
      })
    ]),
    provideAnimationsAsync(),
    NgxSpinnerModule,
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(),
    { provide: AuthInterceptorService, useClass: AuthInterceptorService },
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
]});
