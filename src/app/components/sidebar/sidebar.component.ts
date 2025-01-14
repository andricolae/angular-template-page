import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatListModule],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = true;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
