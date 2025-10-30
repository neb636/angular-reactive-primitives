import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  OnThisPageComponent,
  PageSection,
} from '../../components/on-this-page/on-this-page.component';

@Component({
  selector: 'documentation',
  imports: [],
  template: `
    <div class="documentation">
      <div class="documentation__header">
        <h1 class="documentation__heading">
          <ng-content select="[documentation-title]"></ng-content>
        </h1>
        <p class="documentation__description">
          <ng-content select="[documentation-description]"></ng-content>
        </p>
      </div>

      <div class="documentation__content" #content></div>
    </div>

    <aside class="documentation__sidebar">
      <ng-content select="[sidebar-right]"></ng-content>
    </aside>
  `,
  styleUrls: ['./documentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationComponent {}
