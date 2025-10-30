import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
@Component({
  selector: 'use-mouse-position-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useMousePosition</ng-container>
      <p>Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.</p>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="codeBlock1" [fileType]="'ts'" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseMousePositionPageComponent {
  codeBlock1 = `import { Component } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'cursor-follower',
  template: \`x: {{ mousePosition().x }}, y: {{ mousePosition().y }}\`,
})
export class CursorFollowerComponent {
  mousePosition = useMousePosition();
}`;
  sourceCode = `import { signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useThrottledSignal } from '../../general/use-throttled-signal/use-throttled-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type MousePosition = { x: number; y: number };

/*
 * Creates signals that track the mouse position (x and y coordinates). The signals update
 * when the mouse moves, with throttling to prevent excessive updates.
 */
export const useMousePosition = createSharedComposable((throttleMs = 100) => {
  const document = inject(DOCUMENT);
  const mousePosition = signal<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) =>
    mousePosition.set({ x: event.clientX, y: event.clientY });

  document.defaultView?.addEventListener('mousemove', handleMouseMove);

  return {
    value: useThrottledSignal(mousePosition, throttleMs),
    cleanup: () => {
      document.defaultView?.removeEventListener('mousemove', handleMouseMove);
    },
  };
});
`;
}
