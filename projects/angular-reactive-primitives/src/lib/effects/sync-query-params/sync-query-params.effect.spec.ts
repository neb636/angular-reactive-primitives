import { TestBed } from '@angular/core/testing';
import {
  Component,
  provideZonelessChangeDetection,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { vi, expect } from 'vitest';
import { syncQueryParamsEffect } from './sync-query-params.effect';

describe('syncQueryParamsEffect', () => {
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockActivatedRoute = {};

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter as any },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
  });

  it('should sync query params to URL on initial render', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[0]).toEqual([]);
    expect(firstCall[1]?.relativeTo).toBe(mockActivatedRoute as any);
    expect(firstCall[1]?.queryParams).toEqual({ query: 'test' });
    expect(firstCall[1]?.queryParamsHandling).toBe('merge');
    expect(firstCall[1]?.skipLocationChange).toBe(false);
    expect(firstCall[1]?.replaceUrl).toBe(false);
  });

  it('should sync query param changes to URL', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('initial');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    mockRouter.navigate.mockClear();

    // Update signal
    fixture.componentInstance.query.set('updated');
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({ query: 'updated' });
  });

  it('should support multiple query parameters', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('');
      category = signal('all');
      sort = signal('date');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            query: this.query(),
            category: this.category(),
            sort: this.sort(),
          })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({
      query: '',
      category: 'all',
      sort: 'date',
    });
  });

  it('should use merge as default queryParamsHandling', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParamsHandling).toBe('merge');
  });

  it('should support preserve queryParamsHandling option', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
          options: {
            queryParamsHandling: 'preserve',
          },
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParamsHandling).toBe('preserve');
  });

  it('should support replaceUrl option', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
          options: {
            replaceUrl: true,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.replaceUrl).toBe(true);
  });

  it('should support skipLocationChange option', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
          options: {
            skipLocationChange: true,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.skipLocationChange).toBe(true);
  });

  it('should support multiple options combined', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
          options: {
            queryParamsHandling: 'preserve',
            replaceUrl: true,
            skipLocationChange: false,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[0]).toEqual([]);
    expect(firstCall[1]?.queryParams).toEqual({ query: 'test' });
    expect(firstCall[1]?.queryParamsHandling).toBe('preserve');
    expect(firstCall[1]?.replaceUrl).toBe(true);
    expect(firstCall[1]?.skipLocationChange).toBe(false);
  });

  it('should handle string parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      text = signal('hello world');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ text: this.text() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ text: 'hello world' });
  });

  it('should handle number parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      page = signal(42);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ page: this.page() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ page: 42 });
  });

  it('should handle boolean parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      active = signal(true);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ active: this.active() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ active: true });
  });

  it('should handle null parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      filter = signal<string | null>(null);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ filter: this.filter() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ filter: null });
  });

  it('should handle undefined parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      filter = signal<string | undefined>(undefined);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ filter: this.filter() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ filter: undefined });
  });

  it('should handle empty string parameter values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ query: '' });
  });

  it('should handle multiple rapid updates', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('initial');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    mockRouter.navigate.mockClear();

    // Rapid updates
    component.query.set('update1');
    fixture.detectChanges();
    component.query.set('update2');
    fixture.detectChanges();
    component.query.set('update3');
    fixture.detectChanges();

    // Should have called navigate for each update
    expect(mockRouter.navigate).toHaveBeenCalledTimes(3);

    // Last call should have latest value
    const finalCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(finalCall[1]?.queryParams).toEqual({ query: 'update3' });
  });

  it('should update when any signal in computed changes', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('search');
      category = signal('all');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            query: this.query(),
            category: this.category(),
          })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    mockRouter.navigate.mockClear();

    // Update query
    component.query.set('new search');
    fixture.detectChanges();

    let lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({
      query: 'new search',
      category: 'all',
    });

    mockRouter.navigate.mockClear();

    // Update category
    component.category.set('books');
    fixture.detectChanges();

    lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({
      query: 'new search',
      category: 'books',
    });
  });

  it('should work with computed query params from multiple signals', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      page = signal(1);
      perPage = signal(10);
      sortBy = signal('date');
      sortOrder = signal('desc');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            page: this.page(),
            perPage: this.perPage(),
            sortBy: this.sortBy(),
            sortOrder: this.sortOrder(),
          })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({
      page: 1,
      perPage: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  });

  it('should clean up on component destroy', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    // Should clean up without errors
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should handle router navigation failures gracefully', async () => {
    mockRouter.navigate.mockResolvedValue(false);

    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);

    // Should not throw even if navigation fails
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should use empty options object when no options provided', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
          options: undefined,
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[0]).toEqual([]);
    expect(firstCall[1]?.queryParams).toEqual({ query: 'test' });
    expect(firstCall[1]?.queryParamsHandling).toBe('merge');
    expect(firstCall[1]?.skipLocationChange).toBe(false);
    expect(firstCall[1]?.replaceUrl).toBe(false);
  });

  it('should demonstrate search component use case', () => {
    @Component({
      template: '',
    })
    class SearchComponent {
      query = signal('');
      category = signal('all');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            query: this.query(),
            category: this.category(),
          })),
          options: {
            queryParamsHandling: 'merge',
            replaceUrl: true,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    mockRouter.navigate.mockClear();

    // Simulate user typing in search
    component.query.set('angular');
    fixture.detectChanges();

    let lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({
      query: 'angular',
      category: 'all',
    });
    expect(lastCall[1]?.queryParamsHandling).toBe('merge');
    expect(lastCall[1]?.replaceUrl).toBe(true);

    mockRouter.navigate.mockClear();

    // User changes category
    component.category.set('tutorials');
    fixture.detectChanges();

    lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({
      query: 'angular',
      category: 'tutorials',
    });
    expect(lastCall[1]?.queryParamsHandling).toBe('merge');
    expect(lastCall[1]?.replaceUrl).toBe(true);
  });

  it('should demonstrate pagination use case', () => {
    @Component({
      template: '',
    })
    class PaginationComponent {
      currentPage = signal(1);
      pageSize = signal(20);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            page: this.currentPage(),
            size: this.pageSize(),
          })),
          options: {
            replaceUrl: true,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    mockRouter.navigate.mockClear();

    // User navigates to page 2
    component.currentPage.set(2);
    fixture.detectChanges();

    const lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({ page: 2, size: 20 });
    expect(lastCall[1]?.replaceUrl).toBe(true);
  });

  it('should demonstrate filter panel use case', () => {
    @Component({
      template: '',
    })
    class FilterComponent {
      priceMin = signal(0);
      priceMax = signal(1000);
      inStock = signal(true);

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({
            minPrice: this.priceMin(),
            maxPrice: this.priceMax(),
            inStock: this.inStock(),
          })),
          options: {
            queryParamsHandling: 'merge',
            replaceUrl: true,
          },
        });
      }
    }

    const fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({
      minPrice: 0,
      maxPrice: 1000,
      inStock: true,
    });
  });

  it('should work with multiple components using different params', () => {
    @Component({
      selector: 'test-component-1',
      template: '',
    })
    class TestComponent1 {
      param1 = signal('value1');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ param1: this.param1() })),
        });
      }
    }

    @Component({
      selector: 'test-component-2',
      template: '',
    })
    class TestComponent2 {
      param2 = signal('value2');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ param2: this.param2() })),
        });
      }
    }

    const fixture1 = TestBed.createComponent(TestComponent1);
    fixture1.detectChanges();

    mockRouter.navigate.mockClear();

    const fixture2 = TestBed.createComponent(TestComponent2);
    fixture2.detectChanges();

    // Both effects should call navigate with their own params
    expect(mockRouter.navigate).toHaveBeenCalled();
    const lastCall =
      mockRouter.navigate.mock.calls[mockRouter.navigate.mock.calls.length - 1];
    expect(lastCall[1]?.queryParams).toEqual({ param2: 'value2' });
  });

  it('should handle dynamic object keys in query params', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      filters = signal<Record<string, string>>({
        category: 'books',
        author: 'John Doe',
      });

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => this.filters()),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({
      category: 'books',
      author: 'John Doe',
    });
  });

  it('should handle special characters in query param values', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('hello & goodbye');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalled();
    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.queryParams).toEqual({ query: 'hello & goodbye' });
  });

  it('should pass relativeTo as ActivatedRoute instance', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[1]?.relativeTo).toBe(mockActivatedRoute as any);
  });

  it('should always navigate to empty array path', () => {
    @Component({
      template: '',
    })
    class TestComponent {
      query = signal('test');

      constructor() {
        syncQueryParamsEffect({
          queryParams: computed(() => ({ query: this.query() })),
        });
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const firstCall = mockRouter.navigate.mock.calls[0];
    expect(firstCall[0]).toEqual([]);
  });
});
