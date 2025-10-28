import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
import {
  exampleCode as exampleCodeText,
} from './use-window-size-page.code';

@Component({
  selector: 'use-window-size-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useWindowSize</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks the window size (width and height). Updates when the window is
        resized, with debouncing to prevent excessive updates.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseWindowSizePageComponent {
  parameters = [
    {
      name: 'debounceMs',
      type: 'number',
      description: 'Debounce delay for resize events in milliseconds (default: 100)',
    },
  ];


  exampleCode = exampleCodeText;
}
