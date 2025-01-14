import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {}
