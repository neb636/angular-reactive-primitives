# useDebouncedSignal

Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call.

## Usage

```ts
import { Component, signal, effect } from '@angular/core';
import { useDebouncedSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'search-box',
  template: `<input [(ngModel)]="searchInput" placeholder="Search..." />`,
})
export class SearchBoxComponent {
  searchInput = signal('');
  debouncedSearch = useDebouncedSignal(this.searchInput, 1000);

  // Only fetches if user stops typing for 1 second
  searchResults = resource({
    params: { searchQuery: debouncedSearch() },
    loader: ({ params }) => fetchResults(params)
  });
```
