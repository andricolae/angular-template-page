import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = "AIzaSyBqsg5CZVBbhGSl0p9KrQ_Z5xZGyAFQ44A";
  private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
  private resetPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;
  private verifyemailUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;
  private getUserDataUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`;

  user = new BehaviorSubject<User | null>(null);
  languageSubject = new BehaviorSubject<string>('en');

  constructor(private http: HttpClient, private router: Router, private databaseService: DatabaseService) {
    this.autoLogin();
  }

  signup(email: string, password: string, language: string): Observable<AuthResponseData> {
    const hashedPassword = btoa(password);
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const detectedLanguage = navigator.language.slice(0, 2);

    return this.http.post<AuthResponseData>(this.signUpUrl, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        switchMap((resData) => {
          return this.sendVerificationemail(resData.idToken).pipe(
            switchMap(() => {
              return this.databaseService.saveUserProfile(resData.localId, email, hashedPassword, detectedLanguage, theme);
            }),
            tap(() => {
            }),
            map(() => resData)
          );
        }),
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
        })
      );
  }

  sendVerificationemail(idToken: string): Observable<any> {
    return this.http.post<any>(this.verifyemailUrl, {
      requestType: "VERIFY_email",
      idToken
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    this.user.next(null);
    // console.log('Logging out...');
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }


  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.loginUrl, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        switchMap((resData) => {
          return this.checkEmailVerification(resData.idToken).pipe(
            switchMap((isVerified) => {
              if (!isVerified) {
                return throwError(() => ({
                  error: {
                    error: { message: 'email_NOT_VERIFIED' }
                  }
                }));
              }

              return from(this.databaseService.getUserProfile(resData.localId)).pipe(
                tap(userProfile => {
                  if (userProfile && userProfile.language) {
                    // console.log('User language from database:', userProfile.language);
                    this.languageSubject.next(userProfile.language);
                  }
                }),
                map(() => resData)
              );
            })
          );
        }),
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
        })
      );
  }

  updateUserPassword(newPassword: string): Observable<any> {
    return this.user.pipe(
        take(1),
        switchMap(user => {
            if (!user || !user.token) {
                return throwError(() => new Error('No authenticated user!'));
            }

            return this.http.post<any>(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apiKey}`,
                {
                    idToken: user.token,
                    password: newPassword,
                    returnSecureToken: true
                }
            ).pipe(
                switchMap(resData => {
                    return from(this.databaseService.updateUserPassword(user.id, newPassword)).pipe(
                        map(() => resData)
                    );
                }),
                tap(() => console.log('Password successfully updated in Firebase Authentication and Firestore.')),
                catchError(this.handleError)
            );
        })
    );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
  checkEmailVerification(idToken: string): Observable<boolean> {
    return this.http.post<any>(this.getUserDataUrl, { idToken }).pipe(
      map((res) => {
        const user = res.users ? res.users[0] : null;
        // console.log('User:', user);
        // console.log('email verified:', user?.emailVerified);
        return user?.emailVerified || false;
      }),
      catchError(this.handleError)
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, {
      requestType: "PASSWORD_RESET",
      email
    }).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'email_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'email_NOT_FOUND':
        errorMessage = 'Credentials were not found.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Credentials were not found.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid login credentials.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user has been disabled.';
        break;
      case 'INVALID_ID_TOKEN':
        errorMessage = 'Invalid session token. Please login again.';
        break;
      case 'email_NOT_VERIFIED':
        errorMessage = 'Please verify your email before logging in.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }
}
