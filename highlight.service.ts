import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private highlightedHeaderSubject = new BehaviorSubject<string | null>(null);
  highlightedHeader$ = this.highlightedHeaderSubject.asObservable();

  setHighlightedHeader(headerId: string | null) {
    this.highlightedHeaderSubject.next(headerId);
  }
}
