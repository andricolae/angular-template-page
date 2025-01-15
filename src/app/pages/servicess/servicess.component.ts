import { Component } from '@angular/core';
import { HighlightService } from '../../../../highlight.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './servicess.component.html',
  styleUrl: './servicess.component.css'
})
export class ServicesComponent {
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
