import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, user, User } from '@angular/fire/auth'
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> | undefined;

  private apiKey = "AIzaSyBqsg5CZVBbhGSl0p9KrQ_Z5xZGyAFQ44A";
  private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
  private resetPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`;

  constructor(private http: HttpClient, private auth: Auth) {
    this.user$ = user(auth);
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    })
  }

  getUsername(email: string | null): string {
    return email ? email.split('@')[0] : 'Guest';
  }

  logout() {
    this.userSubject.next(null);
    return this.auth.signOut();
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.signUpUrl, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }
  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.loginUrl, {
      email,
      password,
      returnSecureToken: true
    })
      .pipe(
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
    }
    return throwError(() => new Error(errorMessage));
  }
}
