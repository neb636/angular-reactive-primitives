import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageComponent } from '../../common/layout/documentation-fomat/doc-page.component';

@Component({
  selector: 'app-use-debounced-signal-page',
  imports: [DocPageComponent],
  template: `
    <documentation-format
      title="useDebouncedSignal"
      description="Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call."
      overview="The useDebouncedSignal composable creates a new signal that updates with a delay after the source signal changes. This is particularly useful for search inputs, API calls, or any scenario where you want to reduce the frequency of updates."
      [parameters]="parameters"
      returns="A readonly signal that updates with the debounced value"
      [sourceCode]="sourceCode"
      [exampleCode]="exampleCode"
    />
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
  selector: 'app-search',
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
