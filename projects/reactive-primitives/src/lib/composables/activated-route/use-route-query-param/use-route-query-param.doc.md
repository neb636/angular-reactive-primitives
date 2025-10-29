# useRouteQueryParam

A convenience function that returns a single query parameter as a signal. This is useful when you only need to access one specific query parameter from the URL.

## Usage

### Single Query Parameter

```ts
import { Component, inject } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';

// Route: /products?category=electronics
@Component({
  selector: 'filtered-products',
  template: `
    <div>
      <h2>{{ category() || 'All' }} Products</h2>
      @if (products(); as items) {
        @for (product of items; track product.id) {
          <product-card [product]="product" />
        }
      }
    </div>
  `,
})
export class FilteredProductsComponent {
  category = useRouteQueryParam<string>('category');
  productService = inject(ProductService);

  products = resource({
    request: () => ({ category: this.category() }),
    loader: ({ request }) =>
      this.productService.getByCategory(request.category),
  });
}
```

### Search Query

```ts
import { Component, inject } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';

// Route: /search?q=angular
@Component({
  selector: 'search-page',
  template: `
    <div class="search-page">
      <h1>Search Results for "{{ searchQuery() }}"</h1>

      @if (!searchQuery()) {
        <p>Enter a search term to begin</p>
      } @else if (results(); as items) {
        <p>Found {{ items.length }} results</p>
        @for (result of items; track result.id) {
          <search-result [result]="result" />
        }
      }
    </div>
  `,
})
export class SearchPageComponent {
  searchQuery = useRouteQueryParam<string>('q');
  searchService = inject(SearchService);

  results = resource({
    request: () => ({ query: this.searchQuery() }),
    loader: ({ request }) => {
      if (!request.query) return Promise.resolve([]);
      return this.searchService.search(request.query);
    },
  });
}
```

### Tab Selection

```ts
import { Component, computed } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';
import { Router } from '@angular/router';

type TabId = 'overview' | 'specs' | 'reviews';

// Route: /product?tab=specs
@Component({
  selector: 'product-tabs',
  template: `
    <div class="tabs">
      <button
        (click)="setTab('overview')"
        [class.active]="activeTab() === 'overview'"
      >
        Overview
      </button>
      <button
        (click)="setTab('specs')"
        [class.active]="activeTab() === 'specs'"
      >
        Specifications
      </button>
      <button
        (click)="setTab('reviews')"
        [class.active]="activeTab() === 'reviews'"
      >
        Reviews
      </button>
    </div>

    <div class="tab-content">
      @switch (activeTab()) {
        @case ('overview') {
          <product-overview />
        }
        @case ('specs') {
          <product-specs />
        }
        @case ('reviews') {
          <product-reviews />
        }
      }
    </div>
  `,
})
export class ProductTabsComponent {
  private router = inject(Router);
  tabParam = useRouteQueryParam<string>('tab');

  activeTab = computed<TabId>(() => {
    const tab = this.tabParam();
    if (tab === 'specs' || tab === 'reviews') {
      return tab;
    }
    return 'overview';
  });

  setTab(tab: TabId) {
    this.router.navigate([], {
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }
}
```

### Sort Order

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';
import { Router } from '@angular/router';

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'rating';

// Route: /products?sort=price-low
@Component({
  selector: 'sorted-products',
  template: `
    <div>
      <div class="controls">
        <label>Sort by:</label>
        <select [value]="sortOrder()" (change)="updateSort($event)">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      @if (sortedProducts(); as products) {
        @for (product of products; track product.id) {
          <product-card [product]="product" />
        }
      }
    </div>
  `,
})
export class SortedProductsComponent {
  private router = inject(Router);
  private productService = inject(ProductService);

  sortParam = useRouteQueryParam<string>('sort');

  sortOrder = computed<SortOption>(() => {
    const sort = this.sortParam();
    const validSorts: SortOption[] = [
      'newest',
      'oldest',
      'price-low',
      'price-high',
      'rating',
    ];
    return validSorts.includes(sort as SortOption)
      ? (sort as SortOption)
      : 'newest';
  });

  sortedProducts = resource({
    request: () => ({ sort: this.sortOrder() }),
    loader: ({ request }) =>
      this.productService.getProducts({ sortBy: request.sort }),
  });

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge',
    });
  }
}
```
