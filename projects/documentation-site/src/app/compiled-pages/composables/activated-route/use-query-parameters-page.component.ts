import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-query-parameters-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteQueryParams</ng-container>

      <ng-container documentation-description>
        Exposes all query parameters as a signal-based object. This is useful when you need to access multiple query parameters at once or work with the entire query parameter object reactively.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteQueryParams Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseQueryParametersPageComponent {
  code_usage_0 = `import { Component, computed, inject } from '@angular/core';
import { useRouteQueryParams } from 'angular-reactive-primitives';
import { Router } from '@angular/router';

interface PaginationParams {
  page?: string;
  limit?: string;
}

@Component({
  selector: 'paginated-list',
  template: \`\`,
})
export class PaginatedListComponent {
  router = inject(Router);
  dataService = inject(DataService);

  queryParams = useRouteQueryParams<PaginationParams>();

  items = resource({
    params: () => ({
      page: this.queryParams().page,
      limit: this.queryParams().limit,
    }),
    loader: ({ params }) => this.dataService.getItems(params),
  });

  goToPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}`;

  sourceCode = `import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteQueryParams = <
  T extends { [key: string]: undefined | string },
>() => {
  const route = inject(ActivatedRoute);

  return toSignal(route.queryParams, {
    initialValue: route.snapshot.queryParams,
  }) as Signal<T>;
};
`;
}
