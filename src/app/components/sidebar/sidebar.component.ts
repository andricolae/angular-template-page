import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { HighlightService } from '../../../../highlight.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false;

  constructor(private highlightService: HighlightService, private router: Router) {}

  toggleSidebar() {
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
}
