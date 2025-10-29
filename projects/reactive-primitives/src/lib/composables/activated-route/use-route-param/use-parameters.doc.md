# useRouteParameter

A convenience function that returns a single route parameter as a signal. This is useful when you only need to access one specific parameter from the route.

## Usage

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /products/:productId
@Component({
  selector: 'product-detail',
  template: `
    <div class="product">
      @if (productResource.isLoading()) {
        <p>Loading Product...</p>
      } @else if (productResource.value()) {
        <h1>{{ productResource.value().name }}</h1>
        <p>{{ productResource.value().description }}</p>
      }
    </div>
  `,
})
export class ProductDetailComponent {
  productId = useRouteParameter<string>('productId');
  productService = inject(ProductService);

  productResource = resource({
    params: () => ({ id: this.productId() }),
    loader: ({ params, abortSignal }) =>
      this.productService.getProduct(params, { abortSignal }),
  });
}
```
