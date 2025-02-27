import { Injectable } from "@angular/core";
import { Firestore, doc, getDoc, setDoc, updateDoc } from "@angular/fire/firestore";
import { from, map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private firestore: Firestore) { }

  saveUserProfile(userId: string, email: string,
          hashedPassword: string, language: string,
          theme: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userRef, { email, hashedPassword, language, theme }));
  }

  getUserProfile(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
  }

  getUserLanguage(localId: string): Observable<string> {
    const userRef = doc(this.firestore, `users/${localId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          return userData?.["language"] || 'en';
        } else {
          return 'en';
        }
      })
    );
  }


  updateUserLanguage(userId: string,
                    language: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { language }));
  }

  updateUserTheme(userId: string, theme: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { theme }));
  }

  updateUserPassword(userId: string,
              newPassword: string): Observable<void> {
    const hashedPassword = btoa(newPassword);
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { hashedPassword }));
  }
}
