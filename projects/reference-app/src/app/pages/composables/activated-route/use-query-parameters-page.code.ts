export const sourceCode = `import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useQueryParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.queryParamMap, {
    initialValue: route.snapshot.queryParamMap,
  });

  return computed(() =>
    paramMapSignal().keys.reduce(
      (params, key) => ({ ...params, [key]: paramMapSignal().get(key) }),
      {} as T,
    ),
  );
};

export const useQueryParameter = <T extends undefined | string>(paramName: string) => {
  const queryParameters = useQueryParameters();

  return computed(() => queryParameters()[paramName] as T);
};`;

export const exampleCode = `import { Component, effect } from '@angular/core';
import { useQueryParameters, useQueryParameter } from '@angular/reactive-primitives';

@Component({
  selector: 'product-list',
  template: \`
    <div>
      <h1>Products</h1>
      @if (searchQuery()) {
        <p>Searching for: {{ searchQuery() }}</p>
      }
      @if (category()) {
        <p>Category: {{ category() }}</p>
      }
      @if (sortBy()) {
        <p>Sorted by: {{ sortBy() }}</p>
      }
    </div>
  \`
})
export class ProductListComponent {
  // Get all query parameters as an object
  queryParams = useQueryParameters<{ 
    search?: string; 
    category?: string; 
    sortBy?: string;
  }>();

  // Or get specific query parameters
  searchQuery = useQueryParameter<string | undefined>('search');
  category = useQueryParameter<string | undefined>('category');
  sortBy = useQueryParameter<string | undefined>('sortBy');

  constructor() {
    effect(() => {
      console.log('All query params:', this.queryParams());
      console.log('Search:', this.searchQuery());
      console.log('Category:', this.category());
      console.log('Sort By:', this.sortBy());
    });
  }
}

// URL example: /products?search=laptop&category=electronics&sortBy=price`;
