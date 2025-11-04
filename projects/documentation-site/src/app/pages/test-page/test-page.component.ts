import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useWindowSize, useMousePosition, useDocumentVisibility } from 'angular-reactive-primitives';
import {
  TabGroupComponent,
  TabComponent,
} from '../../common/components/tab-group/tab-group.component';

@Component({
  selector: 'test-page',
  imports: [CommonModule, TabGroupComponent, TabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 30px;
      }

      section {
        margin-bottom: 30px;
      }
    `,
  ],
  template: `
    <section>
      <p>Window width: {{ windowSize().width }}</p>
      <p>Window height: {{ windowSize().height }}</p>
    </section>

    <section>
      <p>Mouse position: {{ mousePosition().x }}, {{ mousePosition().y }}</p>
    </section>

    <section>
      <p>Document visibility: {{ documentVisibility() ? 'Visible' : 'Hidden' }}</p>
    </section>

    

    <section>
      <tab-group>
        <tab label="CLI">npx shadcn-ui@latest add button</tab>
        <tab label="Interface">npm install @shadcn/ui-button</tab>
        <tab label="Other">yarn add @shadcn/ui-button</tab>
     </tab-group>
  </section>
  `,
})
export class TestPageComponent {
  windowSize = useWindowSize();
  mousePosition = useMousePosition();
  mousePosition2 = useMousePosition();
  mousePosition3 = useMousePosition();
  mousePosition4 = useMousePosition();
  mousePosition5 = useMousePosition();
  mousePosition6 = useMousePosition();
  mousePosition7 = useMousePosition();
  mousePosition8 = useMousePosition();
  mousePosition9 = useMousePosition();
  mousePosition10 = useMousePosition();
  mousePosition11 = useMousePosition(2000);
  documentVisibility = useDocumentVisibility();
}
