import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isSidebarOpen.asObservable();

  toggleSidebar() {
    console.log('Sidebar toggle state before:', this.isSidebarOpen.value);
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
    console.log('Sidebar toggle state after:', this.isSidebarOpen.value);  }
}
