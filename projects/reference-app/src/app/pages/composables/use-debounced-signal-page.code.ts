export const sourceCode = `import { Signal, effect, signal } from '@angular/core';
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

export const exampleCode = `import { Component, signal } from '@angular/core';
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
