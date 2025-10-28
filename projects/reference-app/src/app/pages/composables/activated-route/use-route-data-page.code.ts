export const sourceCode = `import { inject, Signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteData = <T extends { [key: string]: any }>() => {
  const route = inject(ActivatedRoute);
  const routeData = toSignal(route.data, { initialValue: route.snapshot.data }) as Signal<T>;

  return computed(() => routeData() || ({} as T));
};`;

export const exampleCode = `import { Component, effect } from '@angular/core';
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
