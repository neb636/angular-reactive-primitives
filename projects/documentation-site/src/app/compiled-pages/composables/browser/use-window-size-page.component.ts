import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
@Component({
  selector: 'use-window-size-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useWindowSize</ng-container>
      <p>Creates signals that track the window size (width and height). The signals update when the window is resized, with debouncing to prevent excessive updates.</p>

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
export class UseWindowSizePageComponent {
  codeBlock1 = `import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'size-aware',
  template: \`
    <h1>Window size:</h1>
    <span>width: {{ windowSize().width }}px</span>
    <span>height: {{ windowSize().height }}px</span>
  \`,
})
export class SizeAwareComponent {
  windowSize = useWindowSize();
}`;
  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useDebouncedSignal } from '../../general/use-debounced-signal/use-debounced-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type WindowSize = {
  width: number;
  height: number;
};

/*
 * Creates signals that track the window size (width and height). The signals update
 * when the window is resized, with debouncing to prevent excessive updates.
 *
 * @param debounceMs - Debounce delay for resize events (default: 100ms)
 *
 * Example:
 *
 * const windowSize = useWindowSize();
 * const { width, height } = windowSize();
 */
export const useWindowSize = createSharedComposable(
  (debounceMs: number = 100) => {
    const document = inject(DOCUMENT);

    const getWindowSize = (): WindowSize => ({
      width: document.defaultView!.innerWidth,
      height: document.defaultView!.innerHeight,
    });

    const windowSizeSignal = signal<WindowSize>(getWindowSize());
    const handleResize = () => windowSizeSignal.set(getWindowSize());

    // Listen for resize events
    document.defaultView?.addEventListener('resize', handleResize);

    // Debounce the signal to prevent excessive updates
    return {
      value: useDebouncedSignal(windowSizeSignal, debounceMs),
      cleanup: () => {
        document.defaultView?.removeEventListener('resize', handleResize);
      },
    };
  },
);
`;
}
