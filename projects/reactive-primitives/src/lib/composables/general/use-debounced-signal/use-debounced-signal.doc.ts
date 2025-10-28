import { DocMetadata, DocEntry } from '../../types/doc-metadata.type';
import sourceCodeRaw from './use-debounced-signal.composable.ts?raw';

export const metadata: DocMetadata = {
  name: 'useDebouncedSignal',
  title: 'useDebouncedSignal',
  description:
    'Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call.',
  category: 'composables',
  subcategory: 'general',
  parameters: [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to debounce',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'The debounce delay in milliseconds',
      optional: true,
      defaultValue: '300',
    },
  ],
  returnType: 'Signal<T>',
  returnDescription: 'A readonly signal that emits the debounced value',
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = `import { Component, signal } from '@angular/core';
import { useDebouncedSignal } from 'reactive-primitives';

@Component({
  selector: 'search',
  template: \`
    <input [(ngModel)]="searchInput" placeholder="Search..." />
    @if (isSearching()) {
      <div>Searching...</div>
    }
    @if (searchResults().length > 0) {
      @for (result of searchResults(); track result.id) {
        <div>{{ result.title }}</div>
      }
    }
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

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
