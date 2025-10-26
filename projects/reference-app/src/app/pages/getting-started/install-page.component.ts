import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block.component';

@Component({
  selector: 'app-install-page',
  imports: [CodeBlockComponent],
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

          <app-code-block title="Install Package" [code]="'npm install @angular/reactive-primitives'" />
          <app-code-block title="Install Package" [code]="'yarn add @angular/reactive-primitives'" />
          <app-code-block title="Install Package" [code]="'pnpm add @angular/reactive-primitives'" />
        </div>

        <div class="doc-section">
          <h2>Basic Usage</h2>
          <p>Import and use the utilities in your components:</p>
          <app-code-block title="Basic Usage" [code]="basicUsageCode" />
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
  styleUrls: ['./install-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
