import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-fragment-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteFragment</ng-container>

      <ng-container documentation-description>
        Exposes the route fragment (the part after #) as a signal. This is useful for implementing smooth scrolling to sections, deep linking, or tracking which section of a page is active.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />

        <code-block [code]="code_usage_1" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteFragment Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteFragmentPageComponent {
  code_usage_0 = `import { useRouteFragment } from 'angular-reactive-primitives';

@Component({})
export class TabbedContentComponent {
  fragment = useRouteFragment();
}`;

  code_usage_1 = `<nav>
  <a routerLink="/docs" fragment="introduction">Introduction</a>
  <a routerLink="/docs" fragment="installation">Installation</a>
  <a routerLink="/docs" fragment="usage">Usage</a>
</nav>`;

  sourceCode = `import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteFragment = () => {
  const route = inject(ActivatedRoute);

  return toSignal(route.fragment, { initialValue: route.snapshot.fragment });
};
`;
}
