# useRouteQueryParam

A convenience function that returns a single query parameter as a signal. This is useful when you only need to access one specific query parameter from the URL.

## Usage

```ts
import { Component, inject } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';

@Component({
  selector: 'search-page',
  template: `
    <div class="search-page">
      <h1>Search Results for "{{ searchQuery() }}"</h1>

      @if (results.value()?.length) {
        @for (result of results.value(); track result.id) {
          <search-result [result]="result" />
        }
      }
    </div>
  `,
})
export class SearchPageComponent {
  searchQuery = useRouteQueryParam<string>('query');
  searchService = inject(SearchService);

  results = resource({
    params: () => ({ query: this.searchQuery() }),
    loader: ({ params, abortSignal }) =>
      this.searchService.search(params, { abortSignal }),
  });
}
```
