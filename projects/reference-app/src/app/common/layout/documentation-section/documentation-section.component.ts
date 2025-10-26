import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'documentation-section',
  styleUrls: ['./documentation-section.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 class="documentation-section__heading">
      <ng-content select="[section-title]"></ng-content>
    </h2>
    <ng-content></ng-content>`,
})
export class DocumentationSectionComponent {}
