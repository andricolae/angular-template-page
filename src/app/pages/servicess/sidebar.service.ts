import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { sidebarConfig } from '../../config/sidebar-config';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isSidebarOpen.asObservable();
  config = sidebarConfig;

  toggleSidebar() {
    if (!this.config.enabled) {
      console.log('Sidebar is not enabled.');
      return;
    }

    const newState = !this.isSidebarOpen.value;
    this.isSidebarOpen.next(newState);
    console.log('Sidebar state toggled:', newState);

    const contentElement = document.querySelector('mat-sidenav-content') as HTMLElement;
    if (contentElement) {
      if (window.innerWidth <= 768) {
        contentElement.style.marginTop = newState ? '300px' : '0';
      } else {
        contentElement.style.marginLeft = newState ? '250px' : '0';
      }
    }
  }
}
