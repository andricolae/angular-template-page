import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { HighlightService } from '../../services/highlight.service';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { SidebarService } from '../../services/sidebar.service';
import topMenuConfig from '../../config/top-menu-config.json';
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemePalette } from '@angular/material/core';
import { ThemeService } from '../../services/theme.service';
interface MenuItem {
  label: string;
  link: string;
  enabled: boolean;
}
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule, LanguageSwitcherComponent, TranslateModule],
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  translate: TranslateService = inject(TranslateService);
  languageService: LanguageService = inject(LanguageService);

  userName: string | undefined = '';

  menuItems: MenuItem[] = [];
  sticky = false;
  transparent = false;
  enabled = false;
  isAuthenticated = false;
  theme: string = 'light';

  private userSub: Subscription | null = null;

  constructor(private router: Router, private highlightService: HighlightService,
      private sidebarService: SidebarService, private cdr: ChangeDetectorRef,
      private authService: AuthService, private themeService: ThemeService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.highlightService.setHighlightedHeader(null);
      }
    });
  }

  ngOnInit(): void {
    this.loadConfig();
    this.languageService.currentLanguage.subscribe((lang) => {
      this.translate.use(lang);
    });
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log('User:', user);
      // console.log(user?.email);
      this.userName = user?.email;
    });
    // console.log(this.userName);
  }

  // retrieveEmail() {
  //   const userData = localStorage.getItem('userData');
  //   let  email = '';
  //   if (userData) {
  //     try {
  //       const userD = JSON.parse(userData);
  //       email = userD.emaiL
  //       console.log(email);
  //     } catch (error) {
  //       console.error('Error parsing userData:', error);
  //     }
  //   } else {
  //     console.warn('No userData found in localStorage');
  //   }
  //   this.userName = email.split('@')[0];
  // }

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

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
