import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-debounced-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDebouncedSignal</ng-container>

      <ng-container documentation-description
        >Creates a debounced signal from a source signal. Useful for things like search inputs where
        you want to debounce the input value before making an API call.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useDebouncedSignal composable creates a new signal that updates with a delay after the
          source signal changes. This is particularly useful for search inputs, API calls, or any
          scenario where you want to reduce the frequency of updates.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useDebouncedSignal Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDebouncedSignalPageComponent {
  parameters = [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to debounce',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'The debounce delay in milliseconds (default: 300)',
    },
  ];

  sourceCode = `import { Signal, effect, signal } from '@angular/core';
import debounce from 'lodash-es/debounce';

/*
 * Creates a debounced signal from a source signal. Useful for things like search inputs where
 * you want to debounce the input value before making an API call.
 *
 * @param sourceSignal - The source signal to debounce.
 * @param delayMs - The debounce delay in milliseconds (default: 300).
 *
 * Example:
 *
 * const searchInputText = signal('');
 *
 * // Create a debounced signal for searchInputText
 * const debouncedSearchInputText = useDebouncedSignal(searchInputText, 500);
 */
export function useDebouncedSignal<T>(sourceSignal: Signal<T>, delayMs: number = 300): Signal<T> {
  const debouncedSignal = signal<T>(sourceSignal());

  const debouncedUpdate = debounce((value: T) => {
    debouncedSignal.set(value);
  }, delayMs);

  effect(() => {
    const value = sourceSignal();
    debouncedUpdate(value);
  });

  return debouncedSignal.asReadonly();
}`;

  exampleCode = `import { Component, signal } from '@angular/core';
import { useDebouncedSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'search',
  template: \`
    <input [(ngModel)]="searchInput" placeholder="Search..." />
    <div *ngIf="isSearching">Searching...</div>
    <div *ngIf="searchResults.length > 0">
      <div *ngFor="let result of searchResults">{{ result.title }}</div>
    </div>
  \`
})
export class SearchComponent {
  searchInput = signal('');
  debouncedSearch = useDebouncedSignal(this.searchInput, 500);
  isSearching = signal(false);
  searchResults = signal<any[]>([]);

  constructor() {
    // React to debounced search changes
    effect(() => {
      const query = this.debouncedSearch();
      if (query.length > 2) {
        this.performSearch(query);
      }
    });
  }

  private async performSearch(query: string) {
    this.isSearching.set(true);
    try {
      const results = await this.searchService.search(query);
      this.searchResults.set(results);
    } finally {
      this.isSearching.set(false);
    }
  }
}`;
}
