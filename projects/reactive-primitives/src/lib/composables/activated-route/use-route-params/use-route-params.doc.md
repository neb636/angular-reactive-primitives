# useRouteParams

A convenience function that wraps Angular's ActivatedRoute.params, exposing all route parameters as a signal-based object. This is useful when you need to access multiple route parameters at once or work with the entire parameter object reactively.

## Usage

```ts
import { Component, computed } from '@angular/core';
import { useRouteParams } from 'angular-reactive-primitives';

// Route: /products/:category/:productId

@Component({
  selector: 'product-breadcrumb',
  template: `
    <nav class="breadcrumb">
      @for (crumb of breadcrumbs(); track crumb.path) {
        <a [routerLink]="crumb.path">{{ crumb.label }}</a>
      }
    </nav>
  `,
})
export class ProductBreadcrumbComponent {
  params = useRouteParams<{ category: string; productId: string }>();

  breadcrumbs = computed(() => {
    const { category, productId } = this.params();

    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: category, path: `/products/${category}` },
      {
        label: `Product ${productId}`,
        path: `/products/${category}/${productId}`,
      },
    ];
  });
}
```
