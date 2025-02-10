import { Component, HostListener, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../services/highlight.service';
import { HttpClient } from '@angular/common/http';
import submenuConfig from '../../config/submenu-config.json';
import { SidebarService } from '../../services/sidebar.service';
import sidebarConfig from '../../config/sidebar-config.json';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatListModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);

  isOpen = false;
  config = sidebarConfig;
  subMenuItems: string[] = [];

  isMobile: boolean = window.innerWidth <= 768;

  constructor(private highlightService: HighlightService, private router: Router, private http: HttpClient, private sidebarService: SidebarService) {
    this.updateSidebarMode();
  }

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
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
  }

  highlightHeader(headerId: string) {
    const currentRoute = this.router.url.split('#')[0];
    this.highlightService.setHighlightedHeader(headerId);
    const targetUrl = `${currentRoute}#${headerId}`;
    this.router.navigate([], { fragment: headerId });
   }

   loadSubMenuItems(routeName: string) {
    const config = submenuConfig as { [key: string]: string[] };
    this.subMenuItems = config[routeName];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
    this.updateSidebarMode();
  }

  updateSidebarMode() {
    if (this.isMobile) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    const contentElement = document.querySelector('mat-sidenav-content') as HTMLElement;
    if (contentElement) {
      if (this.isMobile) {
        contentElement.style.marginTop = this.isOpen ? '300px' : '0';
      } else {
        contentElement.style.marginLeft = this.isOpen ? '250px' : '0';
      }
    }
  }
}
