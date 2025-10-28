import { Routes } from '@angular/router';
import { IntroductionPageComponent } from './pages/getting-started/introduction-page/introduction-page.component';
import { InstallPageComponent } from './pages/getting-started/install-page/install-page.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { generateDocRoutes } from './utils/generate-doc-routes';

const GETTING_STARTED_ROUTES: Routes = [
  {
    path: 'introduction',
    component: IntroductionPageComponent,
    title: 'Introduction',
  },
  {
    path: 'install',
    component: InstallPageComponent,
    title: 'Install',
  },
];

// Dynamically generate documentation routes from the library
const DYNAMIC_DOC_ROUTES = generateDocRoutes();

export const NAVIGATION_ROUTES: Routes = [
  {
    path: 'getting-started',
    title: 'Getting Started',
    children: GETTING_STARTED_ROUTES,
  },
  ...DYNAMIC_DOC_ROUTES,
];

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started/introduction' },
  ...NAVIGATION_ROUTES,
  { path: 'test', title: 'Test', component: TestPageComponent },
  { path: '**', redirectTo: 'getting-started/introduction' },
];
