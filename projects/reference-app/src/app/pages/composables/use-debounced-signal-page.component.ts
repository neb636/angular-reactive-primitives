import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-debounced-signal-page.code';

@Component({
  selector: 'use-debounced-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDebouncedSignal</ng-container>

      <ng-container documentation-description
        >Creates a debounced signal from a source signal. Useful for things like search inputs where
        you want to debounce the input value before making an API call.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useDebouncedSignal Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDebouncedSignalPageComponent {
  parameters = [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to debounce',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'The debounce delay in milliseconds (default: 300)',
    },
  ];

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
