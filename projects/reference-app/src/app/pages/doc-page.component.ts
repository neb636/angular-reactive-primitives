import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-page">
      <div class="doc-content">
        <h1 class="doc-title">{{ title }}</h1>
        <p class="doc-description">{{ description }}</p>

        <div class="doc-section" *ngIf="overview">
          <h2>Overview</h2>
          <p>{{ overview }}</p>
        </div>

        <div class="doc-section" *ngIf="parameters && parameters.length > 0">
          <h2>Parameters</h2>
          <div class="param-list">
            <div class="param-item" *ngFor="let param of parameters">
              <div class="param-name">
                <code>{{ param.name }}</code>
                <span class="param-type">{{ param.type }}</span>
              </div>
              <p class="param-description">{{ param.description }}</p>
            </div>
          </div>
        </div>

        <div class="doc-section" *ngIf="returns">
          <h2>Returns</h2>
          <p>{{ returns }}</p>
        </div>

        <div class="doc-section" *ngIf="sourceCode">
          <h2>Source Code</h2>
          <div class="code-block">
            <div class="code-header">
              <span>{{ title }} Source</span>
              <button class="copy-button" (click)="copyCode(sourceCode)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>{{ sourceCode }}</code></pre>
          </div>
        </div>

        <div class="doc-section" *ngIf="exampleCode">
          <h2>Example Usage</h2>
          <div class="code-block">
            <div class="code-header">
              <span>Example Usage</span>
              <button class="copy-button" (click)="copyCode(exampleCode)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <pre><code>{{ exampleCode }}</code></pre>
          </div>
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

    .param-list {
      space-y: 16px;
    }

    .param-item {
      margin-bottom: 16px;
    }

    .param-name {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .param-name code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .param-type {
      background: #f3f4f6;
      color: #6b7280;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }

    .param-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
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
export class DocPageComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() overview?: string;
  @Input() parameters?: Array<{ name: string; type: string; description: string }>;
  @Input() returns?: string;
  @Input() sourceCode?: string;
  @Input() exampleCode?: string;

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }
}
