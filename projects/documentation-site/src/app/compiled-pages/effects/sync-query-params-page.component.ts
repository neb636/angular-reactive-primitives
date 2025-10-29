import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'sync-query-params-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>syncQueryParamsEffect</ng-container>

      <ng-container documentation-description>
        Effect that syncs signal state to URL query parameters (one-way: signal → URL). This is useful when you want to make application state shareable via URL without reading from query params.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />

        <code-block [code]="code_usage_1" />

        <code-block [code]="code_usage_2" />

        <code-block [code]="code_usage_3" />

        <code-block [code]="code_usage_4" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="syncQueryParamsEffect Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncQueryParamsPageComponent {
  code_usage_0 = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'product-filters',
  template: \`
    <div class="filters">
      <input [(ngModel)]="searchQuery" placeholder="Search products..." />

      <select [(ngModel)]="category">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
        <option value="clothing">Clothing</option>
      </select>

      <select [(ngModel)]="sortBy">
        <option value="newest">Newest</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  \`,
})
export class ProductFiltersComponent {
  searchQuery = signal('');
  category = signal('');
  sortBy = signal('newest');

  // Combine all filter state
  filterParams = computed(() => ({
    q: this.searchQuery(),
    category: this.category(),
    sort: this.sortBy(),
  }));

  constructor() {
    // Sync to URL: ?q=laptop&category=electronics&sort=price
    syncQueryParamsEffect({
      queryParams: this.filterParams,
    });
  }
}`;

  code_usage_1 = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'paginated-list',
  template: \`
    <div class="pagination">
      <button (click)="previousPage()" [disabled]="page() === 1">
        Previous
      </button>
      <span>Page {{ page() }}</span>
      <button (click)="nextPage()">Next</button>
    </div>
  \`,
})
export class PaginatedListComponent {
  page = signal(1);
  pageSize = signal(20);

  paginationParams = computed(() => ({
    page: this.page(),
    limit: this.pageSize(),
  }));

  constructor() {
    // Sync to URL: ?page=3&limit=20
    syncQueryParamsEffect({
      queryParams: this.paginationParams,
    });
  }

  nextPage() {
    this.page.update((p) => p + 1);
  }

  previousPage() {
    this.page.update((p) => Math.max(1, p - 1));
  }
}`;

  code_usage_2 = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'search-form',
  template: \`
    <form>
      <input [(ngModel)]="query" placeholder="Search..." />
      <button type="button" (click)="clearSearch()">Clear</button>
    </form>
  \`,
})
export class SearchFormComponent {
  query = signal('');

  queryParams = computed(() => ({
    q: this.query(),
  }));

  constructor() {
    // Use replaceUrl to avoid cluttering browser history
    syncQueryParamsEffect({
      queryParams: this.queryParams,
      options: {
        replaceUrl: true,
        queryParamsHandling: 'merge',
      },
    });
  }

  clearSearch() {
    this.query.set('');
  }
}`;

  code_usage_3 = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'multi-filter',
  template: \`
    <div class="filters">
      <h3>Brands</h3>
      @for (brand of availableBrands; track brand) {
        <label>
          <input
            type="checkbox"
            [checked]="selectedBrands().includes(brand)"
            (change)="toggleBrand(brand)"
          />
          {{ brand }}
        </label>
      }

      <h3>Price Range</h3>
      <input
        type="range"
        [value]="maxPrice()"
        (input)="updateMaxPrice(\$event)"
        min="0"
        max="1000"
      />
      <span>\${{ maxPrice() }}</span>
    </div>
  \`,
})
export class MultiFilterComponent {
  selectedBrands = signal<string[]>([]);
  maxPrice = signal(1000);
  availableBrands = ['Apple', 'Samsung', 'Sony', 'LG'];

  filterParams = computed(() => ({
    brands: this.selectedBrands().join(','),
    maxPrice: this.maxPrice(),
  }));

  constructor() {
    // Sync to URL: ?brands=Apple,Samsung&maxPrice=500
    syncQueryParamsEffect({
      queryParams: this.filterParams,
      options: {
        queryParamsHandling: 'merge',
      },
    });
  }

  toggleBrand(brand: string) {
    this.selectedBrands.update((brands) => {
      if (brands.includes(brand)) {
        return brands.filter((b) => b !== brand);
      }
      return [...brands, brand];
    });
  }

  updateMaxPrice(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.maxPrice.set(value);
  }
}`;

  code_usage_4 = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from 'angular-reactive-primitives';

type TabId = 'overview' | 'specs' | 'reviews';

@Component({
  selector: 'tabbed-view',
  template: \`
    <div class="tabs">
      @for (tab of tabs; track tab.id) {
        <button
          (click)="selectTab(tab.id)"
          [class.active]="activeTab() === tab.id"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  \`,
})
export class TabbedViewComponent {
  activeTab = signal<TabId>('overview');

  tabs = [
    { id: 'overview' as TabId, label: 'Overview' },
    { id: 'specs' as TabId, label: 'Specifications' },
    { id: 'reviews' as TabId, label: 'Reviews' },
  ];

  tabParams = computed(() => ({
    tab: this.activeTab(),
  }));

  constructor() {
    // Sync to URL: ?tab=specs
    syncQueryParamsEffect({
      queryParams: this.tabParams,
      options: {
        replaceUrl: false,
        queryParamsHandling: 'merge',
      },
    });
  }

  selectTab(tabId: TabId) {
    this.activeTab.set(tabId);
  }
}`;

  sourceCode = `import { Signal, inject, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export type QueryParamEffectOptions = {
  queryParamsHandling?: 'merge' | 'preserve';
  replaceUrl?: boolean;
  skipLocationChange?: boolean;
};

export type SyncQueryParamsEffectConfig = {
  queryParams: Signal<Record<string, unknown>>;
  options?: QueryParamEffectOptions;
};

/**
 * Effect to sync query params with the application state for the current route.
 *
 * @param config - Configuration object
 * @param config.queryParams - Signal containing query params
 * @param config.options - Optional options for query params handling
 *   - queryParamsHandling: 'merge' (default) | 'preserve'
 *   - replaceUrl: Whether to replace the current URL with the new one (default: false)
 *   - skipLocationChange: Whether to skip location change (default: false)
 *
 * Example:
 *
 * export class MyComponent {
 *   private selectedLabel = signal('');
 *   private query = signal('');
 *
 *   constructor() {
 *     syncQueryParamsEffect({
 *       queryParams: computed(() => ({ selectedLabel: this.selectedLabel(), query: this.query() })),
 *       options: { queryParamsHandling: 'preserve' }
 *     });
 *   }
 * }
 */
export const syncQueryParamsEffect = (config: SyncQueryParamsEffectConfig) => {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  const {
    queryParamsHandling = 'merge',
    skipLocationChange = false,
    replaceUrl = false,
  } = config.options || {};

  return effect(() => {
    const queryParams = config.queryParams();

    router.navigate([], {
      relativeTo: activatedRoute,
      queryParams,
      queryParamsHandling,
      skipLocationChange,
      replaceUrl,
    });
  });
};
`;
}
