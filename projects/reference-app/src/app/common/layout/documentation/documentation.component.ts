import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'documentation',
  imports: [],
  template: `
    <h1 class="documentation__heading"><ng-content select="[documentation-title]"></ng-content></h1>
    <p class="documentation__description">
      <ng-content select="[documentation-description]"></ng-content>
    </p>

    <div class="documentation__content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./documentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationComponent {}
