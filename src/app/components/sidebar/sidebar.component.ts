import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../../../highlight.service';
import { sidebarConfig } from '../../config/sidebar-config';
import { HttpClient } from '@angular/common/http';
import submenuConfig from '../../config/submenu-config.json';
import { SidebarService } from '../../pages/servicess/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false;
  config = sidebarConfig;
  subMenuItems: string[] = [];

  constructor(private highlightService: HighlightService, private router: Router, private http: HttpClient, private sidebarService: SidebarService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[1] || 'home';
        console.log('Current Route:', currentRoute);
        this.loadSubMenuItems(currentRoute);
      }
    });
    this.sidebarService.isOpen$.subscribe((isOpen) => {
      console.log('Sidebar received toggle state:', isOpen);
      this.isOpen = this.isOpen;
    })
  }
  toggleSidebar() {
    if (!this.config.enabled) {
      return;
    }

    this.isOpen = !this.isOpen;
    const contentElement = document.querySelector('mat-sidenav-content') as HTMLElement;
    if (contentElement) {
      if (window.innerWidth <= 768) {
        contentElement.style.marginTop = this.isOpen ? '300px' : '0';
      } else {
        contentElement.style.marginLeft = this.isOpen ? '250px' : '0';
      }
    }
  }

  highlightHeader(headerId: string) {
    const currentRoute = this.router.url.split('#')[0];
    this.highlightService.setHighlightedHeader(headerId);
    const targetUrl = `${currentRoute}#${headerId}`;
    this.router.navigate([], { fragment: headerId });
   }

   loadSubMenuItems(routeName: string) {
    console.log(`Loading submenu for route: ${routeName}`);
    const config = submenuConfig as { [key: string]: string[] };
    console.log('Loaded Config:', config);
    this.subMenuItems = config[routeName]?.map((item) => this.formatMenuItem(item)) || [];
    console.log('Submenu Items:', this.subMenuItems);
  }

  formatMenuItem(item: string): string {
    return item
      .replace(/-/g, ' ') // Replace dashes with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }
}
