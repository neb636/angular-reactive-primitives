import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'documentation-section',
  styleUrls: ['./documentation-section.component.scss'],
  imports: [CommonModule],
  template: `<h2 class="documentation-section__heading">{{ heading() }}</h2>
    <ng-content></ng-content>`,
})
export class DocumentationSectionComponent {
  heading = input('');
}
