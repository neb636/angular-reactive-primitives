import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="doc-layout">
      <header class="doc-header">
        <div class="header-left">
          <div class="brand">
            <h1>Angular Reactive Primitives</h1>
          </div>
        </div>

        <div class="header-right">
          <button class="icon-button" title="Releases">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </button>
          <button class="icon-button" title="Help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
              />
            </svg>
          </button>
          <button class="icon-button" title="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </button>
        </div>
      </header>

      <div class="doc-content">
        <aside class="doc-sidebar">
          <div class="search-container">
            <input type="text" placeholder="Search Reference..." class="search-input" />
            <span class="search-shortcut">/</span>
          </div>

          <nav class="doc-nav">
            <div class="nav-section">
              <h3 class="nav-title">Getting started</h3>
              <ul class="nav-list">
                <li>
                  <a
                    routerLink="/"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                    >Introduction</a
                  >
                </li>
                <li><a routerLink="/install" routerLinkActive="active">Install</a></li>
              </ul>
            </div>

            <div class="nav-section">
              <h3 class="nav-title">Composables</h3>
              <ul class="nav-list">
                <li>
                  <a routerLink="/composables/use-debounced-signal" routerLinkActive="active"
                    >useDebouncedSignal</a
                  >
                </li>
                <li>
                  <a routerLink="/composables/use-previous-signal" routerLinkActive="active"
                    >usePreviousSignal</a
                  >
                </li>
                <li>
                  <a routerLink="/composables/use-throttled-signal" routerLinkActive="active"
                    >useThrottledSignal</a
                  >
                </li>
                <li class="nav-subsection">
                  <span class="nav-subtitle">Activated Route</span>
                  <ul class="nav-sublist">
                    <li>
                      <a routerLink="/composables/use-parameters" routerLinkActive="active"
                        >useParameters</a
                      >
                    </li>
                    <li>
                      <a routerLink="/composables/use-query-parameters" routerLinkActive="active"
                        >useQueryParameters</a
                      >
                    </li>
                    <li>
                      <a routerLink="/composables/use-route-data" routerLinkActive="active"
                        >useRouteData</a
                      >
                    </li>
                    <li>
                      <a routerLink="/composables/use-route-fragment" routerLinkActive="active"
                        >useRouteFragment</a
                      >
                    </li>
                  </ul>
                </li>
                <li class="nav-subsection">
                  <span class="nav-subtitle">Browser</span>
                  <ul class="nav-sublist">
                    <li>
                      <a routerLink="/composables/use-document-visibility" routerLinkActive="active"
                        >useDocumentVisibility</a
                      >
                    </li>
                    <li>
                      <a routerLink="/composables/use-media-query" routerLinkActive="active"
                        >useMediaQuery</a
                      >
                    </li>
                    <li>
                      <a routerLink="/composables/use-window-size" routerLinkActive="active"
                        >useWindowSize</a
                      >
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="nav-section">
              <h3 class="nav-title">Effects</h3>
              <ul class="nav-list">
                <li>
                  <a routerLink="/effects/log-changes" routerLinkActive="active">logChanges</a>
                </li>
                <li>
                  <a routerLink="/effects/sync-local-storage" routerLinkActive="active"
                    >syncLocalStorage</a
                  >
                </li>
                <li>
                  <a routerLink="/effects/sync-query-params" routerLinkActive="active"
                    >syncQueryParams</a
                  >
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <main class="doc-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
