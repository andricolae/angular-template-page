import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
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
  private verifyEmailUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;
  private getUserDataUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`;

  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.signUpUrl, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        switchMap((resData) => {
          return this.sendVerificationEmail(resData.idToken);
        }),
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentification(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
        })
      );
  }

  sendVerificationEmail(idToken: string): Observable<any> {
    return this.http.post<any>(this.verifyEmailUrl, {
      requestType: "VERIFY_EMAIL",
      idToken
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    this.user.next(null);
    console.log('Logging out...');
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  private handleAuthentification(email: string, userId: string, token: string, expiresIn: number) {
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
                    error: { message: 'EMAIL_NOT_VERIFIED' }
                  }
                }));
              }
              return [resData];
            })
          );
        }),
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentification(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
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
        console.log('User:', user);
        console.log('Email verified:', user?.emailVerified);
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
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
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
      case 'EMAIL_NOT_VERIFIED':
          errorMessage = 'Please verify your email before logging in.';
          break;
    }
    return throwError(() => new Error(errorMessage));
  }
}
