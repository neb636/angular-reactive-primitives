import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
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
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <button class="icon-button" title="Help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </button>
          <button class="icon-button" title="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
                <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Introduction</a></li>
                <li><a routerLink="/install" routerLinkActive="active">Install</a></li>
              </ul>
            </div>

            <div class="nav-section">
              <h3 class="nav-title">Composables</h3>
              <ul class="nav-list">
                <li><a routerLink="/composables/use-debounced-signal" routerLinkActive="active">useDebouncedSignal</a></li>
                <li><a routerLink="/composables/use-previous-signal" routerLinkActive="active">usePreviousSignal</a></li>
                <li><a routerLink="/composables/use-throttled-signal" routerLinkActive="active">useThrottledSignal</a></li>
                <li class="nav-subsection">
                  <span class="nav-subtitle">Activated Route</span>
                  <ul class="nav-sublist">
                    <li><a routerLink="/composables/use-parameters" routerLinkActive="active">useParameters</a></li>
                    <li><a routerLink="/composables/use-query-parameters" routerLinkActive="active">useQueryParameters</a></li>
                    <li><a routerLink="/composables/use-route-data" routerLinkActive="active">useRouteData</a></li>
                    <li><a routerLink="/composables/use-route-fragment" routerLinkActive="active">useRouteFragment</a></li>
                  </ul>
                </li>
                <li class="nav-subsection">
                  <span class="nav-subtitle">Browser</span>
                  <ul class="nav-sublist">
                    <li><a routerLink="/composables/use-document-visibility" routerLinkActive="active">useDocumentVisibility</a></li>
                    <li><a routerLink="/composables/use-media-query" routerLinkActive="active">useMediaQuery</a></li>
                    <li><a routerLink="/composables/use-window-size" routerLinkActive="active">useWindowSize</a></li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="nav-section">
              <h3 class="nav-title">Effects</h3>
              <ul class="nav-list">
                <li><a routerLink="/effects/log-changes" routerLinkActive="active">logChanges</a></li>
                <li><a routerLink="/effects/sync-local-storage" routerLinkActive="active">syncLocalStorage</a></li>
                <li><a routerLink="/effects/sync-query-params" routerLinkActive="active">syncQueryParams</a></li>
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
  styles: [`
    .doc-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f8f9fa;
    }

    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 64px;
      background: white;
      border-bottom: 1px solid #e1e5e9;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header-left .brand h1 {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .header-left .brand .subtitle {
      font-size: 12px;
      color: #6b7280;
      margin-left: 8px;
    }

    .header-center {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .environment-selector {
      font-size: 14px;
      color: #374151;
    }

    .preview-badge {
      background: #8b5cf6;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-button {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .doc-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

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

    .doc-main {
      flex: 1;
      background: white;
      overflow-y: auto;
      padding: 0;
    }
  `]
})
export class AppComponent {}
