import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'sync-query-params-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>syncQueryParamsEffect</ng-container>

      <ng-container documentation-description
        >Effect to sync query parameters with application state. Automatically updates the URL when
        your signal-based state changes.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'syncQueryParamsEffect Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncQueryParamsPageComponent {
  parameters = [
    {
      name: 'config.queryParams',
      type: 'Signal<Record<string, unknown>>',
      description: 'Signal containing the query parameters to sync with the URL',
    },
    {
      name: 'config.options.queryParamsHandling',
      type: "'merge' | 'preserve'",
      description: "How to handle existing query params (default: 'merge')",
    },
    {
      name: 'config.options.replaceUrl',
      type: 'boolean',
      description:
        'Whether to replace the current URL instead of pushing a new history entry (default: false)',
    },
    {
      name: 'config.options.skipLocationChange',
      type: 'boolean',
      description: 'Whether to skip updating the browser location (default: false)',
    },
  ];

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
};`;

  exampleCode = `import { Component, signal, computed } from '@angular/core';
import { syncQueryParamsEffect } from '@angular/reactive-primitives';

// Example 1: Sync filter state with URL
@Component({
  selector: 'product-filter',
  template: \`
    <div>
      <input 
        [value]="searchQuery()" 
        (input)="searchQuery.set($any($event.target).value)"
        placeholder="Search products..."
      />
      
      <select 
        [value]="category()" 
        (change)="category.set($any($event.target).value)"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
      </select>

      <select 
        [value]="sortBy()" 
        (change)="sortBy.set($any($event.target).value)"
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  \`
})
export class ProductFilterComponent {
  searchQuery = signal('');
  category = signal('');
  sortBy = signal('name');

  constructor() {
    // Sync all filter state to URL query params
    syncQueryParamsEffect({
      queryParams: computed(() => ({
        search: this.searchQuery(),
        category: this.category(),
        sort: this.sortBy(),
      })),
    });
  }
}

// Example 2: Pagination state
@Component({
  selector: 'paginated-list',
  template: \`
    <div>
      <div>Page {{ currentPage() }} of {{ totalPages }}</div>
      <button (click)="previousPage()" [disabled]="currentPage() === 1">
        Previous
      </button>
      <button (click)="nextPage()" [disabled]="currentPage() === totalPages">
        Next
      </button>
    </div>
  \`
})
export class PaginatedListComponent {
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalPages = 10;

  constructor() {
    syncQueryParamsEffect({
      queryParams: computed(() => ({
        page: this.currentPage(),
        perPage: this.itemsPerPage(),
      })),
      options: {
        replaceUrl: true, // Replace instead of push to avoid cluttering history
      },
    });
  }

  nextPage() {
    this.currentPage.update(page => Math.min(page + 1, this.totalPages));
  }

  previousPage() {
    this.currentPage.update(page => Math.max(page - 1, 1));
  }
}

// Example 3: Complex form state
@Component({
  selector: 'advanced-search',
  template: \`<form><!-- form fields --></form>\`
})
export class AdvancedSearchComponent {
  // Form fields
  keyword = signal('');
  dateFrom = signal('');
  dateTo = signal('');
  tags = signal<string[]>([]);
  includeArchived = signal(false);

  constructor() {
    syncQueryParamsEffect({
      queryParams: computed(() => ({
        q: this.keyword(),
        from: this.dateFrom(),
        to: this.dateTo(),
        tags: this.tags().join(','),
        archived: this.includeArchived() ? 'true' : 'false',
      })),
      options: {
        queryParamsHandling: 'merge', // Merge with existing params
      },
    });
  }
}`;
}
