import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-data-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteData</ng-container>

      <ng-container documentation-description
        >Creates a computed signal that contains route data defined in the route configuration. Useful for accessing static or resolved data associated with a route.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useRouteData composable creates a signal that automatically tracks route data.
          Route data is typically defined in your route configuration and can include things like
          page titles, breadcrumb information, permissions, or any custom data you want to associate
          with a route.
        </p>
        <p>
          This composable is particularly useful when combined with route resolvers, allowing you to
          access resolved data reactively in your components.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useRouteData Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteDataPageComponent {
  parameters = [
    {
      name: 'T',
      type: 'generic type',
      description: 'Type of the route data object (default: { [key: string]: any })',
    },
  ];

  sourceCode = `import { inject, Signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteData = <T extends { [key: string]: any }>() => {
  const route = inject(ActivatedRoute);
  const routeData = toSignal(route.data, { initialValue: route.snapshot.data }) as Signal<T>;

  return computed(() => routeData() || ({} as T));
};`;

  exampleCode = `import { Component, effect } from '@angular/core';
import { useRouteData } from '@angular/reactive-primitives';

// Define the shape of your route data
type PageRouteData = {
  title: string;
  breadcrumb: string;
  requiresAuth?: boolean;
  user?: { id: string; name: string };
};

@Component({
  selector: 'page-component',
  template: \`
    <div>
      @if (routeData().title) {
        <h1>{{ routeData().title }}</h1>
      }
      @if (routeData().breadcrumb) {
        <nav>{{ routeData().breadcrumb }}</nav>
      }
      @if (routeData().user) {
        <p>Welcome, {{ routeData().user.name }}</p>
      }
    </div>
  \`
})
export class PageComponent {
  routeData = useRouteData<PageRouteData>();

  constructor() {
    effect(() => {
      const data = this.routeData();
      console.log('Route data:', data);
      console.log('Title:', data.title);
      console.log('Requires auth:', data.requiresAuth);
    });
  }
}

// Route configuration:
// {
//   path: 'dashboard',
//   component: PageComponent,
//   data: {
//     title: 'Dashboard',
//     breadcrumb: 'Home > Dashboard',
//     requiresAuth: true
//   },
//   resolve: {
//     user: UserResolver
//   }
// }`;
}
