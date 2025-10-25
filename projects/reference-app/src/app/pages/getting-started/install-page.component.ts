import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-page">
      <div class="doc-content">
        <h1 class="doc-title">Installation</h1>
        <p class="doc-description">
          Get started with Angular Reactive Primitives by installing the package and importing the utilities you need.
        </p>

        <div class="doc-section">
          <h2>Installation</h2>
          <p>Install the package using your preferred package manager:</p>
          
          <div class="code-block">
            <div class="code-header">
              <span>Install Package</span>
              <button class="copy-button" (click)="copyCode('npm install @angular/reactive-primitives')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>npm install @angular/reactive-primitives</code></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span>Install Package</span>
              <button class="copy-button" (click)="copyCode('yarn add @angular/reactive-primitives')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>yarn add @angular/reactive-primitives</code></pre>
          </div>

          <div class="code-block">
            <div class="code-header">
              <span>Install Package</span>
              <button class="copy-button" (click)="copyCode('pnpm add @angular/reactive-primitives')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>pnpm add @angular/reactive-primitives</code></pre>
          </div>
        </div>

        <div class="doc-section">
          <h2>Basic Usage</h2>
          <p>Import and use the utilities in your components:</p>
          
          <div class="code-block">
            <div class="code-header">
              <span>Basic Usage</span>
              <button class="copy-button" (click)="copyCode(basicUsageCode)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>{{ basicUsageCode }}</code></pre>
          </div>
        </div>

        <div class="doc-section">
          <h2>Requirements</h2>
          <ul>
            <li>Angular 17+ (with signals support)</li>
            <li>TypeScript 5.0+</li>
            <li>Node.js 18+</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doc-page {
      padding: 48px;
      max-width: 800px;
    }

    .doc-title {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 16px 0;
      line-height: 1.1;
    }

    .doc-description {
      font-size: 20px;
      color: #6b7280;
      margin: 0 0 48px 0;
      line-height: 1.6;
    }

    .doc-section {
      margin-bottom: 48px;
    }

    .doc-section h2 {
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
    }

    .doc-section p {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .doc-section ul {
      margin: 0;
      padding-left: 24px;
    }

    .doc-section li {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .code-block {
      background: #1e1b4b;
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #312e81;
      color: #e0e7ff;
      font-size: 14px;
      font-weight: 500;
    }

    .copy-button {
      background: none;
      border: none;
      color: #e0e7ff;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .copy-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .code-block pre {
      margin: 0;
      padding: 16px;
      background: #1e1b4b;
      color: #e0e7ff;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 1.5;
      overflow-x: auto;
    }

    .code-block code {
      color: #e0e7ff;
    }
  `]
})
export class InstallPageComponent {
  basicUsageCode = `import { Component, signal } from '@angular/core';
import { useDebouncedSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'app-example',
  template: \`
    <input [(ngModel)]="searchInput" />
    <p>Debounced: {{ debouncedSearch() }}</p>
  \`
})
export class ExampleComponent {
  searchInput = signal('');
  debouncedSearch = useDebouncedSignal(this.searchInput, 300);
}`;

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }
}
