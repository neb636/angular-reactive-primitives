import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-parameters-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useParameters</ng-container>

      <ng-container documentation-description
        >Creates a computed signal that contains all route parameters. Returns an object with parameter names as keys and their values as strings.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useParameters composable creates a signal that automatically tracks all route parameters.
          It converts the Angular route's paramMap into a simple object structure, making it easy to
          access parameters reactively in your components.
        </p>
        <p>
          Additionally, the useParameter function allows you to access a specific route parameter by name,
          returning a computed signal for just that parameter value.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useParameters Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseParametersPageComponent {
  parameters = [
    {
      name: 'T',
      type: 'generic type',
      description: 'Type of the parameters object (default: { [key: string]: undefined | string })',
    },
  ];

  sourceCode = `import { computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.paramMap, { initialValue: route.snapshot.paramMap });

  return computed(() =>
    paramMapSignal().keys.reduce(
      (params, key) => ({ ...params, [key]: paramMapSignal().get(key) }),
      {} as T,
    ),
  );
};

export const useParameter = <T extends undefined | string>(paramName: string) => {
  const parameters = useParameters();

  return computed(() => parameters()[paramName] as T);
};`;

  exampleCode = `import { Component, effect } from '@angular/core';
import { useParameters, useParameter } from '@angular/reactive-primitives';

@Component({
  selector: 'user-profile',
  template: \`
    <div>
      <h1>User Profile</h1>
      @if (userId()) {
        <p>User ID: {{ userId() }}</p>
      }
      @if (tabName()) {
        <p>Current Tab: {{ tabName() }}</p>
      }
    </div>
  \`
})
export class UserProfileComponent {
  // Get all parameters as an object
  params = useParameters<{ userId: string; tabName?: string }>();

  // Or get a specific parameter
  userId = useParameter<string>('userId');
  tabName = useParameter<string | undefined>('tabName');

  constructor() {
    effect(() => {
      console.log('All params:', this.params());
      console.log('User ID:', this.userId());
      console.log('Tab Name:', this.tabName());
    });
  }
}

// Route configuration:
// { path: 'user/:userId/:tabName', component: UserProfileComponent }`;
}
