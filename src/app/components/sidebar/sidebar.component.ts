import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false; // Sidebar starts closed

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
  highlightHeader(id: string) {
    document.querySelectorAll('h1, h2, h3').forEach(el => el.classList.remove('highlight'));
    const header = document.getElementById(id);
    if (header) {
      header.classList.add('highlight');
    }
  }
}
