# useRouteQueryParams

Exposes all query parameters as a signal-based object. This is useful when you need to access multiple query parameters at once or work with the entire query parameter object reactively.

## Usage

### Search and Filter

```ts
import { Component, inject } from '@angular/core';
import { useRouteQueryParams } from 'angular-reactive-primitives';

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}

// Route: /search?q=laptop&category=electronics&sort=price&page=1
@Component({
  selector: 'search-results',
  template: `
    <div class="search">
      <h1>Search Results</h1>
      <div class="filters">
        <input
          [value]="queryParams().q || ''"
          (input)="updateQuery($event)"
          placeholder="Search..."
        />
        <select
          [value]="queryParams().category || ''"
          (change)="updateCategory($event)"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      @if (results(); as products) {
        @for (product of products; track product.id) {
          <product-card [product]="product" />
        }
      }
    </div>
  `,
})
export class SearchResultsComponent {
  queryParams = useRouteQueryParams<SearchParams>();
  searchService = inject(SearchService);
  router = inject(Router);

  results = resource({
    request: () => this.queryParams(),
    loader: ({ request }) => this.searchService.search(request),
  });

  updateQuery(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.router.navigate([], {
      queryParams: { ...this.queryParams(), q: query },
      queryParamsHandling: 'merge',
    });
  }

  updateCategory(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      queryParams: { ...this.queryParams(), category },
      queryParamsHandling: 'merge',
    });
  }
}
```

### Pagination

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteQueryParams } from 'angular-reactive-primitives';
import { Router } from '@angular/router';

interface PaginationParams {
  page?: string;
  limit?: string;
}

@Component({
  selector: 'paginated-list',
  template: `
    <div class="list">
      @for (item of items(); track item.id) {
        <div class="item">{{ item.name }}</div>
      }
    </div>

    <div class="pagination">
      <button
        (click)="goToPage(currentPage() - 1)"
        [disabled]="currentPage() === 1"
      >
        Previous
      </button>
      <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
      <button
        (click)="goToPage(currentPage() + 1)"
        [disabled]="currentPage() === totalPages()"
      >
        Next
      </button>
    </div>
  `,
})
export class PaginatedListComponent {
  queryParams = useRouteQueryParams<PaginationParams>();
  router = inject(Router);
  dataService = inject(DataService);

  currentPage = computed(() => parseInt(this.queryParams().page || '1', 10));

  pageSize = computed(() => parseInt(this.queryParams().limit || '20', 10));

  items = resource({
    request: () => ({
      page: this.currentPage(),
      limit: this.pageSize(),
    }),
    loader: ({ request }) =>
      this.dataService.getItems(request.page, request.limit),
  });

  totalPages = computed(() =>
    Math.ceil((this.items().total || 0) / this.pageSize()),
  );

  goToPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
```

### Complex Filters

```ts
import { Component, computed } from '@angular/core';
import { useRouteQueryParams } from 'angular-reactive-primitives';

interface FilterParams {
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  inStock?: string;
  rating?: string;
}

@Component({
  selector: 'product-filters',
  template: `
    <div class="filters">
      <h3>Filters</h3>

      <div class="filter-group">
        <label>Price Range</label>
        <input
          type="number"
          [value]="activeFilters().minPrice || ''"
          placeholder="Min"
        />
        <input
          type="number"
          [value]="activeFilters().maxPrice || ''"
          placeholder="Max"
        />
      </div>

      <div class="filter-group">
        <label>
          <input
            type="checkbox"
            [checked]="activeFilters().inStock === 'true'"
          />
          In Stock Only
        </label>
      </div>

      <div class="active-filters">
        <h4>Active Filters: {{ filterCount() }}</h4>
        @if (hasFilters()) {
          <button (click)="clearAllFilters()">Clear All</button>
        }
      </div>
    </div>
  `,
})
export class ProductFiltersComponent {
  queryParams = useRouteQueryParams<FilterParams>();

  activeFilters = computed(() => this.queryParams());

  filterCount = computed(() => {
    const params = this.queryParams();
    return Object.keys(params).length;
  });

  hasFilters = computed(() => this.filterCount() > 0);

  clearAllFilters() {
    this.router.navigate([], {
      queryParams: {},
    });
  }
}
```
