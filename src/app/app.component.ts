import { Component, OnInit } from '@angular/core';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TopMenuComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TemplateWebsite';
  theme: string = 'light';
  constructor(private themeService: ThemeService) {}
  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }
}
