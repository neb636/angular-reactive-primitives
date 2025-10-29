import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-query-param-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteQueryParam</ng-container>

      <ng-container documentation-description>
        A convenience function that returns a single query parameter as a signal. This is useful when you only need to access one specific query parameter from the URL.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteQueryParam Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteQueryParamPageComponent {
  code_usage_0 = `import { Component, inject } from '@angular/core';
import { useRouteQueryParam } from 'angular-reactive-primitives';

@Component({
  selector: 'search-page',
  template: \`
    <div class="search-page">
      <h1>Search Results for "{{ searchQuery() }}"</h1>

      @if (results.value()?.length) {
        @for (result of results.value(); track result.id) {
          <search-result [result]="result" />
        }
      }
    </div>
  \`,
})
export class SearchPageComponent {
  searchQuery = useRouteQueryParam<string>('query');
  searchService = inject(SearchService);

  results = resource({
    params: () => ({ query: this.searchQuery() }),
    loader: ({ params, abortSignal }) =>
      this.searchService.search(params, { abortSignal }),
  });
}`;

  sourceCode = `import { computed } from '@angular/core';
import { useRouteQueryParams } from '../use-route-query-params/use-query-parameters.composable';

export const useRouteQueryParam = <T extends undefined | string>(
  paramName: string,
) => {
  const queryParams = useRouteQueryParams();

  return computed(() => queryParams()[paramName] as T);
};
`;
}
