import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-document-visibility-page.code';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-document-visibility-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDocumentVisibility</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks whether the document/tab is visible or hidden. Updates when
        the user switches tabs or minimizes the window.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useDocumentVisibility Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDocumentVisibilityPageComponent {
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
