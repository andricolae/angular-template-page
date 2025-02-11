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
  apiKey: "AIzaSyAubzKJeHlwP8OHFZvx9NbcAwbfbtsGjdQ",
  authDomain: "templatewebsite-3e4ee.firebaseapp.com",
  databaseURL: "https://templatewebsite-3e4ee-default-rtdb.firebaseio.com",
  projectId: "templatewebsite-3e4ee",
  storageBucket: "templatewebsite-3e4ee.appspot.com",
  messagingSenderId: "722715285210",
  appId: "1:722715285210:web:5fed25b07716267df5f7e3",
  measurementId: "G-RMHMD8KE9V"
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
