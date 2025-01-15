import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { footerConfig } from '../../config/footer-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatToolbarModule, CommonModule],
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  config = footerConfig;

  get isEnabled() {
    return this.config.enabled;
  }

  get isSticky() {
    return this.config.sticky;
  }
}
