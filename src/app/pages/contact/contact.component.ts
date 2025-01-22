import { Component } from '@angular/core';
import { HighlightService } from '../../services/highlight.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  constructor(private highlightService: HighlightService) {}

  ngOnInit() {
    this.highlightService.highlightedHeader$.subscribe((headerId) => {
      if (headerId) {
        document.querySelectorAll('h1, h2, h3').forEach((el) => el.classList.remove('highlight'));
        const header = document.getElementById(headerId);
        if (header) {
          header.classList.add('highlight');
        }
      }
    });
  }
}
