# useRouteParameter

A convenience function that returns a single route parameter as a signal. This is useful when you only need to access one specific parameter from the route.

## Usage

```ts
import { useRouteParameter } from 'angular-reactive-primitives';

@Component({})
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
