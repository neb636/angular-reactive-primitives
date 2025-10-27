import { Routes } from '@angular/router';
import { IntroductionPageComponent } from './pages/getting-started/introduction-page/introduction-page.component';
import { InstallPageComponent } from './pages/getting-started/install-page/install-page.component';
import { UseDebouncedSignalPageComponent } from './pages/composables/use-debounced-signal-page.component';
import { UsePreviousSignalPageComponent } from './pages/composables/use-previous-signal-page.component';
import { UseThrottledSignalPageComponent } from './pages/composables/use-throttled-signal-page.component';
import { UseParametersPageComponent } from './pages/composables/activated-route/use-parameters-page.component';
import { UseQueryParametersPageComponent } from './pages/composables/activated-route/use-query-parameters-page.component';
import { UseRouteDataPageComponent } from './pages/composables/activated-route/use-route-data-page.component';
import { UseRouteFragmentPageComponent } from './pages/composables/activated-route/use-route-fragment-page.component';
import { UseDocumentVisibilityPageComponent } from './pages/composables/browser/use-document-visibility-page.component';
import { UseMediaQueryPageComponent } from './pages/composables/browser/use-media-query-page.component';
import { UseWindowSizePageComponent } from './pages/composables/browser/use-window-size-page.component';
import { SyncLocalStoragePageComponent } from './pages/effects/sync-local-storage-page.component';
import { SyncQueryParamsPageComponent } from './pages/effects/sync-query-params-page.component';
import { LogChangesPageComponent } from './pages/effects/log-changes-page.component';
import { CreateSingletonComposablePageComponent } from './pages/utils/create-singleton-composable-page.component';

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

const COMPOSABLE_ROUTES: Routes = [
  {
    path: 'activated-route',
    title: 'Activated Route',
    children: [
      {
        path: 'use-parameters',
        component: UseParametersPageComponent,
        title: 'useParameters',
      },
      {
        path: 'use-query-parameters',
        component: UseQueryParametersPageComponent,
        title: 'useQueryParameters',
      },
      {
        path: 'use-route-data',
        component: UseRouteDataPageComponent,
        title: 'useRouteData',
      },
      {
        path: 'use-route-fragment',
        component: UseRouteFragmentPageComponent,
        title: 'useRouteFragment',
      },
    ],
  },
  {
    path: 'browser',
    title: 'Browser',
    children: [
      {
        path: 'use-document-visibility',
        component: UseDocumentVisibilityPageComponent,
        title: 'useDocumentVisibility',
      },
      {
        path: 'use-media-query',
        component: UseMediaQueryPageComponent,
        title: 'useMediaQuery',
      },
      {
        path: 'use-window-size',
        component: UseWindowSizePageComponent,
        title: 'useWindowSize',
      },
    ],
  },
  {
    path: 'general',
    title: 'General',
    children: [
      {
        path: 'use-debounced-signal',
        component: UseDebouncedSignalPageComponent,
        title: 'useDebouncedSignal',
      },
      {
        path: 'use-previous-signal',
        component: UsePreviousSignalPageComponent,
        title: 'usePreviousSignal',
      },
      {
        path: 'use-throttled-signal',
        component: UseThrottledSignalPageComponent,
        title: 'useThrottledSignal',
      },
    ],
  },
];

const EFFECT_ROUTES: Routes = [
  {
    path: 'sync-local-storage',
    component: SyncLocalStoragePageComponent,
    title: 'syncLocalStorage',
  },
  {
    path: 'sync-query-params',
    component: SyncQueryParamsPageComponent,
    title: 'syncQueryParams',
  },
  {
    path: 'log-changes',
    component: LogChangesPageComponent,
    title: 'logChanges',
  },
];

const UTIL_ROUTES: Routes = [
  {
    path: 'create-singleton-composable',
    component: CreateSingletonComposablePageComponent,
    title: 'createSingletonComposable',
  },
];

export const NAVIGATION_ROUTES: Routes = [
  { path: 'getting-started', title: 'Getting Started', children: GETTING_STARTED_ROUTES },
  { path: 'composables', title: 'Composables', children: COMPOSABLE_ROUTES },
  { path: 'effects', title: 'Effects', children: EFFECT_ROUTES },
  { path: 'utils', title: 'Utils', children: UTIL_ROUTES },
];

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started/introduction' },
  ...NAVIGATION_ROUTES,
  { path: '**', redirectTo: 'getting-started/introduction' },
];
