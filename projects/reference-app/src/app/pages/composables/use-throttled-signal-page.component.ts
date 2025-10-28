import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
import {
  sourceCode as sourceCodeText,
  exampleCode as exampleCodeText,
} from './use-throttled-signal-page.code';

@Component({
  selector: 'use-throttled-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useThrottledSignal</ng-container>

      <ng-container documentation-description
        >Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first
        value immediately and then waits for the throttle period before emitting subsequent
        values.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useThrottledSignal Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseThrottledSignalPageComponent {
  parameters = [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to throttle',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'The throttle delay in milliseconds (default: 300)',
    },
  ];

  sourceCode = sourceCodeText;

  exampleCode = exampleCodeText;
}
