import { Routes } from '@angular/router';
import { IntroductionPageComponent } from './pages/getting-started/introduction-page/introduction-page.component';
import { InstallPageComponent } from './pages/getting-started/install-page/install-page.component';
import { UseDebouncedSignalPageComponent } from './pages/composables/use-debounced-signal-page.component';
import { UsePreviousSignalPageComponent } from './pages/composables/use-previous-signal-page.component';
import { SyncLocalStoragePageComponent } from './pages/effects/sync-local-storage-page.component';

const gettingStartedRoutes: Routes = [
  {
    path: 'introduction',
    component: IntroductionPageComponent,
    title: 'Introduction • Angular Reactive Primitives',
  },
  {
    path: 'install',
    component: InstallPageComponent,
    title: 'Install • Angular Reactive Primitives',
  },
];

const composablesRoutes: Routes = [
  {
    path: 'activated-route',
    children: [],
  },
  {
    path: 'browser',
    children: [],
  },
  {
    path: 'use-debounced-signal',
    component: UseDebouncedSignalPageComponent,
    title: 'useDebouncedSignal • Angular Reactive Primitives',
  },
  {
    path: 'use-previous-signal',
    component: UsePreviousSignalPageComponent,
    title: 'usePreviousSignal • Angular Reactive Primitives',
  },
];

const effectsRoutes: Routes = [
  {
    path: 'sync-local-storage',
    component: SyncLocalStoragePageComponent,
    title: 'syncLocalStorage • Angular Reactive Primitives',
  },
];

export const NAVIGATION_ROUTES: Routes = [
  { path: 'getting-started', children: gettingStartedRoutes },
  { path: 'composables', children: composablesRoutes },
  { path: 'effects', children: effectsRoutes },
];

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started/introduction' },
  ...NAVIGATION_ROUTES,
  { path: '**', redirectTo: 'getting-started/introduction' },
];
