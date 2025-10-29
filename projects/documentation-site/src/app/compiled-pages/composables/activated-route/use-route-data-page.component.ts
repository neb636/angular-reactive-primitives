import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-data-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteData</ng-container>

      <ng-container documentation-description>
        Exposes route data as a signal-based object. This is useful when you need to access route data reactively, such as for permissions, page titles, or custom metadata attached to routes.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />

        <code-block [code]="code_usage_1" />

        <code-block [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteData Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteDataPageComponent {
  code_usage_0 = `const PROFILE_ROUTE = {
  path: 'profile',
  component: ProfileComponent,
  resolve: { user: userResolver },
  data: { title: 'User Profile' },
};`;

  code_usage_1 = `import { useRouteData } from 'angular-reactive-primitives';

@Component({})
class ProfileComponent {
  routeData = useRouteData<{ title: string; user: User }>();
}`;

  code_usage_2 = `<h1>{{ routeData().title }}</h1>

<div>
  <h2>{{ routeData().user?.name }}</h2>
  <p>{{ routeData().user?.biography }}</p>
</div>`;

  sourceCode = `import { inject, Signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteData = <T extends { [key: string]: any }>() => {
  const route = inject(ActivatedRoute);
  const routeData = toSignal(route.data, { initialValue: route.snapshot.data }) as Signal<T>;

  return computed(() => routeData() || ({} as T));
};
`;
}
