import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navigation-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="navigation-sidebar">
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
  `,
  styleUrls: ['./navigation-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {}
