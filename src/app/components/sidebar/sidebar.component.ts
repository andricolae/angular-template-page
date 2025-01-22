import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../services/highlight.service';
import { HttpClient } from '@angular/common/http';
import submenuConfig from '../../config/submenu-config.json';
import { SidebarService } from '../../services/sidebar.service';
import sidebarConfig from '../../config/sidebar-config.json';

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
        this.loadSubMenuItems(currentRoute);
      }
    });
    this.sidebarService.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
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
    const config = submenuConfig as { [key: string]: string[] };
    this.subMenuItems = config[routeName]?.map((item) => this.formatMenuItem(item)) || [];
  }

  formatMenuItem(item: string): string {
    return item
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
