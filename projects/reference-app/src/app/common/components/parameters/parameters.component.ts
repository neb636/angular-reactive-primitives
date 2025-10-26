import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationSectionComponent } from '../../layout/documentation-section/documentation-section.component';

@Component({
  selector: 'parameters',
  styleUrls: ['./parameters.component.css'],
  imports: [CommonModule, DocumentationSectionComponent],
  template: `<documentation-section>
    <ng-container section-title>Parameters</ng-container>
    <div class="param-list">
      @for (param of parameters(); track param.name) {
        <div class="param-item">
          <div class="param-name">
            <code>{{ param.name }}</code>
            <span class="param-type">{{ param.type }}</span>
          </div>
          <p class="param-description">{{ param.description }}</p>
        </div>
      }
    </div>
  </documentation-section> `,
})
export class ParametersComponent {
  parameters = input.required<Array<{ name: string; type: string; description: string }>>();
}
