import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private highlightedHeaderSubject = new BehaviorSubject<string | null>(null);
  highlightedHeader$ = this.highlightedHeaderSubject.asObservable();

  setHighlightedHeader(headerId: string) {
    this.highlightedHeaderSubject.next(headerId);
  }
}
