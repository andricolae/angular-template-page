import { provideRouter } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/servicess/servicess.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
