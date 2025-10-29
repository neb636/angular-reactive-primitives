import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-parameters-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteParameter</ng-container>

      <ng-container documentation-description>
        A convenience function that returns a single route parameter as a signal. This is useful when you only need to access one specific parameter from the route.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteParameter Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseParametersPageComponent {
  code_usage_0 = `import { useRouteParameter } from 'angular-reactive-primitives';

@Component({})
export class ProductDetailComponent {
  productId = useRouteParameter<string>('productId');
  productService = inject(ProductService);

  productResource = resource({
    params: () => ({ id: this.productId() }),
    loader: ({ params, abortSignal }) =>
      this.productService.getProduct(params, { abortSignal }),
  });
}`;

  sourceCode = `import { computed } from '@angular/core';
import { useRouteParams } from '../use-route-params/use-route-params.composable';

export const useRouteParameter = <T extends string | null | undefined>(
  paramName: string,
) => {
  const parameters = useRouteParams();

  return computed(() => parameters()[paramName] as T);
};
`;
}
