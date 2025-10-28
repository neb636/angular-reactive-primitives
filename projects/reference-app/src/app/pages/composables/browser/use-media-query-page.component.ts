import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-media-query-page.code';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-media-query-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useMediaQuery</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks whether a media query matches. Updates when the media query
        match state changes (e.g., window resize, orientation change).</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useMediaQuery Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseMediaQueryPageComponent {
  parameters = [
    {
      name: 'query',
      type: 'string',
      description: 'The media query string to match against (e.g., "(max-width: 768px)")',
    },
  ];

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
