import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { DetailsPageComponent } from './pages/details-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent, title: 'Dashboard • Reference App' },
  { path: 'details/:id', component: DetailsPageComponent, title: 'Details • Reference App' },
  { path: 'settings', component: SettingsPageComponent, title: 'Settings • Reference App' },
  { path: '**', redirectTo: 'dashboard' },
];
