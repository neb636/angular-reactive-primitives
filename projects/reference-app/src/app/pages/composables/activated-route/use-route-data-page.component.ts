import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-route-data-page.code';
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
        >Creates a computed signal that contains route data defined in the route configuration.
        Useful for accessing static or resolved data associated with a route.</ng-container
      >

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

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
