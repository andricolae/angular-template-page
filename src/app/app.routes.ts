import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { ServicesComponent } from './pages/company_services/company_services.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { PreferencesComponent } from './components/preferences/preferences.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'countries', component: CountriesComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
