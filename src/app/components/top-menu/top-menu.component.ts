import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../services/highlight.service';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { SidebarService } from '../../services/sidebar.service';
import topMenuConfig from '../../config/top-menu-config.json';

interface MenuItem {
  label: string;
  link: string;
  enabled: boolean;
}
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule, LanguageSwitcherComponent],
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  menuItems: MenuItem[] = [];
  sticky = false;
  transparent = false;
  enabled = false;

  constructor(private router: Router, private highlightService: HighlightService, private sidebarService: SidebarService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.highlightService.setHighlightedHeader(null);
      }
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.menuItems = topMenuConfig.menuItems.filter((item) => item.enabled);
    this.sticky = topMenuConfig.sticky;
    this.transparent = topMenuConfig.transparent;
    this.enabled = topMenuConfig.enabled;
  }

  config = topMenuConfig;

  get isTransparent() {
    return this.config.transparent;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
