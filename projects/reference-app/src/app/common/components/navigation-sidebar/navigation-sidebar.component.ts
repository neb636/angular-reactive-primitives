import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-doc-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
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
  `,
  styles: `
    .doc-sidebar {
      width: 280px;
      background: #f1f3f4;
      border-right: 1px solid #e1e5e9;
      overflow-y: auto;
      padding: 24px 0;
    }

    .search-container {
      position: relative;
      margin: 0 16px 24px;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    .search-shortcut {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #9ca3af;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .doc-nav {
      padding: 0 16px;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-list li {
      margin-bottom: 2px;
    }

    .nav-list a {
      display: block;
      padding: 8px 12px;
      color: #6b7280;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .nav-list a:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .nav-list a.active {
      background: #8b5cf6;
      color: white;
    }

    .nav-subsection {
      margin-top: 8px;
    }

    .nav-subtitle {
      display: block;
      padding: 8px 12px 4px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-sublist {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-sublist li {
      margin-bottom: 1px;
    }

    .nav-sublist a {
      padding-left: 24px;
      font-size: 13px;
    }

    .nav-sublist a.active {
      border-left: 3px solid #8b5cf6;
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {}
