import { Routes } from '@angular/router';
import { IntroductionPageComponent } from './pages/getting-started/introduction-page/introduction-page.component';
import { InstallPageComponent } from './pages/getting-started/install-page/install-page.component';
import { UseDebouncedSignalPageComponent } from './pages/composables/use-debounced-signal-page.component';
import { UsePreviousSignalPageComponent } from './pages/composables/use-previous-signal-page.component';
import { SyncLocalStoragePageComponent } from './pages/effects/sync-local-storage-page.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'introduction' },
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
  {
    path: 'composables/use-debounced-signal',
    component: UseDebouncedSignalPageComponent,
    title: 'useDebouncedSignal • Angular Reactive Primitives',
  },
  {
    path: 'composables/use-previous-signal',
    component: UsePreviousSignalPageComponent,
    title: 'usePreviousSignal • Angular Reactive Primitives',
  },
  {
    path: 'effects/sync-local-storage',
    component: SyncLocalStoragePageComponent,
    title: 'syncLocalStorage • Angular Reactive Primitives',
  },
  { path: '**', redirectTo: 'introduction' },
];
