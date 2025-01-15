import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../../../highlight.service';
import { topMenuConfig } from '../../config/top-menu-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule],
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  constructor(private router: Router, private highlightService: HighlightService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.highlightService.setHighlightedHeader(null);
        console.log('TopMenuComponent: Navigation ended, highlight reset');
      }
    });
  }

  config = topMenuConfig;

  get isVisible() {
    return this.config.enabled;
  }

  get isTransparent() {
    return this.config.transparent;
  }
}
