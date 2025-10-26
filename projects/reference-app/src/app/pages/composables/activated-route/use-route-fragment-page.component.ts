import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-fragment-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteFragment</ng-container>

      <ng-container documentation-description
        >Creates a signal that contains the URL fragment (hash). Useful for implementing anchor navigation or tracking hash-based routing.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useRouteFragment composable creates a signal that automatically tracks the URL fragment
          (the part after the # symbol in the URL). This is commonly used for implementing smooth
          scrolling to sections, tracking anchor links, or implementing hash-based navigation patterns.
        </p>
        <p>
          The signal will update reactively whenever the URL fragment changes, allowing you to respond
          to these changes in your component logic or templates.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useRouteFragment Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteFragmentPageComponent {
  parameters = [
    {
      name: 'None',
      type: 'N/A',
      description: 'This composable takes no parameters',
    },
  ];

  sourceCode = `import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteFragment = () => {
  const route = inject(ActivatedRoute);

  return toSignal(route.fragment, { initialValue: route.snapshot.fragment });
};`;

  exampleCode = `import { Component, effect, ElementRef, viewChild } from '@angular/core';
import { useRouteFragment } from '@angular/reactive-primitives';

@Component({
  selector: 'documentation-page',
  template: \`
    <div>
      <nav>
        <a routerLink="." fragment="overview">Overview</a>
        <a routerLink="." fragment="installation">Installation</a>
        <a routerLink="." fragment="usage">Usage</a>
      </nav>

      @if (fragment()) {
        <p>Current section: {{ fragment() }}</p>
      }

      <section #overview id="overview">
        <h2>Overview</h2>
        <p>Content...</p>
      </section>

      <section #installation id="installation">
        <h2>Installation</h2>
        <p>Content...</p>
      </section>

      <section #usage id="usage">
        <h2>Usage</h2>
        <p>Content...</p>
      </section>
    </div>
  \`
})
export class DocumentationPageComponent {
  fragment = useRouteFragment();

  constructor() {
    // Automatically scroll to the section when fragment changes
    effect(() => {
      const currentFragment = this.fragment();
      if (currentFragment) {
        const element = document.getElementById(currentFragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}

// URL examples:
// /docs#overview
// /docs#installation
// /docs#usage`;
}
