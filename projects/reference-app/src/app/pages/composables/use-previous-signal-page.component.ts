import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-previous-signal-page.code';

@Component({
  selector: 'use-previous-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>usePreviousSignal</ng-container>
      <ng-container documentation-description
        >Creates a signal that holds the previous value of a source signal. Useful for tracking
        changes and implementing undo functionality.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'usePreviousSignal Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsePreviousSignalPageComponent {
  parameters = [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to track the previous value of',
    },
  ];

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
