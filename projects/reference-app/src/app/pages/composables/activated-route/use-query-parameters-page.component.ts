import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-query-parameters-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useQueryParameters</ng-container>

      <ng-container documentation-description
        >Creates a computed signal that contains all query parameters from the URL. Returns an object with query parameter names as keys and their values as strings.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useQueryParameters composable creates a signal that automatically tracks all URL query parameters.
          It converts the Angular route's queryParamMap into a simple object structure, making it easy to
          access query parameters reactively in your components.
        </p>
        <p>
          Additionally, the useQueryParameter function allows you to access a specific query parameter by name,
          returning a computed signal for just that parameter value.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useQueryParameters Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseQueryParametersPageComponent {
  parameters = [
    {
      name: 'T',
      type: 'generic type',
      description: 'Type of the query parameters object (default: { [key: string]: undefined | string })',
    },
  ];

  sourceCode = `import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useQueryParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.queryParamMap, {
    initialValue: route.snapshot.queryParamMap,
  });

  return computed(() =>
    paramMapSignal().keys.reduce(
      (params, key) => ({ ...params, [key]: paramMapSignal().get(key) }),
      {} as T,
    ),
  );
};

export const useQueryParameter = <T extends undefined | string>(paramName: string) => {
  const queryParameters = useQueryParameters();

  return computed(() => queryParameters()[paramName] as T);
};`;

  exampleCode = `import { Component, effect } from '@angular/core';
import { useQueryParameters, useQueryParameter } from '@angular/reactive-primitives';

@Component({
  selector: 'product-list',
  template: \`
    <div>
      <h1>Products</h1>
      @if (searchQuery()) {
        <p>Searching for: {{ searchQuery() }}</p>
      }
      @if (category()) {
        <p>Category: {{ category() }}</p>
      }
      @if (sortBy()) {
        <p>Sorted by: {{ sortBy() }}</p>
      }
    </div>
  \`
})
export class ProductListComponent {
  // Get all query parameters as an object
  queryParams = useQueryParameters<{ 
    search?: string; 
    category?: string; 
    sortBy?: string;
  }>();

  // Or get specific query parameters
  searchQuery = useQueryParameter<string | undefined>('search');
  category = useQueryParameter<string | undefined>('category');
  sortBy = useQueryParameter<string | undefined>('sortBy');

  constructor() {
    effect(() => {
      console.log('All query params:', this.queryParams());
      console.log('Search:', this.searchQuery());
      console.log('Category:', this.category());
      console.log('Sort By:', this.sortBy());
    });
  }
}

// URL example: /products?search=laptop&category=electronics&sortBy=price`;
}
