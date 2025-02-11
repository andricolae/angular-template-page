import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  updateUsername(email: string | null) {
    if (email) {
      const username = email.split('@')[0];
      this.usernameSubject.next(username);
    } else {
      this.usernameSubject.next(null);
    }
  }
}
