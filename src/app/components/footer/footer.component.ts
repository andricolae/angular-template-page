import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import footerConfig from '../../config/footer-config.json';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatToolbarModule, CommonModule],
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // config = footerConfig;
  // config: { enabled: boolean; sticky: boolean } = { enabled: footerConfig.enabled, sticky: footerConfig.sticky };
  config: { enabled: boolean; sticky: boolean } = footerConfig;

  get isEnabled() {
    return this.config.enabled;
  }

  get isSticky() {
    return this.config.sticky;
  }

  // constructor(private http: HttpClient) {}

  // ngOnInit(): void {
  //   this.loadConfig();
  // }

  // loadConfig(): void {
  //   this.http.get<{ enabled: boolean; sticky: boolean }>(footerConfig).subscribe(
  //     (config) => {
  //       this.config = config;
  //       console.log('Footer Config Loaded:', this.config);
  //     },
  //     (error) => {
  //       console.error('Failed to load footer configuration:', error);
  //     }
  //   );
  // }
}
