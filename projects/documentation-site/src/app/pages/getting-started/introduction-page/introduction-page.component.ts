import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';

@Component({
  selector: 'introduction-page',
  imports: [RouterLink, CodeBlockComponent, DocumentationSectionComponent, DocumentationComponent],
  template: `
    <documentation>
      <ng-container documentation-title>Angular Reactive Primitives</ng-container>
      <ng-container documentation-description>
        Small, composable building blocks that extend Angular's signal system. Generic utilities for
        modern Angular 20+ apps.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Quick Example</ng-container>
        <code-block [code]="exampleCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Key Features</ng-container>
        <ul>
          <li><strong>Small & Focused</strong> - One thing well, compose as needed</li>
          <li><strong>Flexible</strong> - Generic building blocks, not prescriptive solutions</li>
          <li><strong>Extendable</strong> - Built on Angular signals, easy to customize</li>
          <li><strong>SSR Compatible</strong> - Works with Angular server-side rendering</li>
          <li><strong>Type-safe</strong> - Full TypeScript support</li>
          <li><strong>Tree-shakable</strong> - Import only what you need</li>
          <li><strong>Angular 20+</strong> - Modern reactive/functional patterns</li>
        </ul>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Philosophy</ng-container>
        <ul>
          <li>Angular's signals are simple and powerful—we build on that foundation</li>
          <li>Generic utilities you compose, not specific solutions</li>
          <li>Small functions that integrate naturally with Angular's reactivity</li>
        </ul>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Getting Started</ng-container>
        <a routerLink="/install" class="doc-button">Install & Explore</a>
      </documentation-section>
    </documentation>
  `,
  styleUrls: ['./introduction-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {
  exampleCode = `import { Component, signal } from '@angular/core';
import { useDebouncedSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'search-component',
  template: \`
    <input [value]="search()" (input)="search.set($any($event.target).value)" />
    <p>Debounced: {{ debouncedSearch() }}</p>
  \`
})
export class SearchComponent {
  search = signal('');
  debouncedSearch = useDebouncedSignal(this.search, 300);
}`;
}
