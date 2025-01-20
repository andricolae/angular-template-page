import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../../../highlight.service';
import { topMenuConfig } from '../../config/top-menu-config';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { SidebarService } from '../../pages/servicess/sidebar.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule, LanguageSwitcherComponent],
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  constructor(private router: Router, private highlightService: HighlightService, private sidebarService: SidebarService) {
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

  toggleSidebar() {
    console.log('Toggle button clicked');
    this.sidebarService.toggleSidebar();
  }
}
