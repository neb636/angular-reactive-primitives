import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-route-fragment-page.code';
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
        >Creates a signal that contains the URL fragment (hash). Useful for implementing anchor
        navigation or tracking hash-based routing.</ng-container
      >

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

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
