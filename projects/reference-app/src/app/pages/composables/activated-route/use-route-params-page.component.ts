import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-params-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteParams</ng-container>

      <ng-container documentation-description>
        A convenience function that wraps Angular's ActivatedRoute.params, exposing all route parameters as a signal-based object. This is useful when you need to access multiple route parameters at once or work with the entire parameter object reactively.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Resource Fetching Example" [code]="code_usage_0" />

        <code-block title="Reactive Computations" [code]="code_usage_1" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteParams Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteParamsPageComponent {
  code_usage_0 = `import { Component, inject } from '@angular/core';
import { resource } from '@angular/core';
import { useRouteParams } from 'angular-reactive-primitives';

// Route: /blog/:slug/:commentId
@Component({
  /* ... */
})
export class BlogPostComponent {
  blogService = inject(BlogService);

  params = useRouteParams<{
    slug: string;
    commentId?: string;
    somethingElse: string;
  }>();

  postResource = resource({
    params: () => ({
      slug: this.params().slug,
      highlightComment: this.params().commentId,
    }),
    loader: ({ params, abortSignal }) =>
      this.blogService.fetchPost(params, { abortSignal }),
  });
}`;

  code_usage_1 = `import { Component, computed } from '@angular/core';
import { useRouteParams } from 'angular-reactive-primitives';

// Route: /products/:category/:productId
@Component({
  selector: 'product-breadcrumb',
  template: \`
    <nav class="breadcrumb">
      @for (crumb of breadcrumbs(); track crumb.path) {
        <a [routerLink]="crumb.path">{{ crumb.label }}</a>
      }
    </nav>
  \`,
})
export class ProductBreadcrumbComponent {
  params = useRouteParams<{ category: string; productId: string }>();

  breadcrumbs = computed(() => {
    const { category, productId } = this.params();

    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: category, path: \`/products/\${category}\` },
      {
        label: \`Product \${productId}\`,
        path: \`/products/\${category}/\${productId}\`,
      },
    ];
  });
}`;

  sourceCode = `import { Signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteParams = <
  T extends { [key: string]: string | null },
>() => {
  const route = inject(ActivatedRoute);

  return toSignal(route.params, {
    initialValue: route.snapshot.params,
  }) as Signal<T>;
};
`;
}
