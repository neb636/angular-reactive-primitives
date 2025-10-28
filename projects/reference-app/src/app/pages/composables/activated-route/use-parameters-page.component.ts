import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-parameters-page.code';
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
        >Creates a computed signal that contains all route parameters. Returns an object with
        parameter names as keys and their values as strings.</ng-container
      >

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

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
