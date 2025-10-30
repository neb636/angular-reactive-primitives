import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
@Component({
  selector: 'use-throttled-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useThrottledSignal</ng-container>
      <p>Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value immediately and then waits for the throttle period before emitting subsequent values.</p>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseThrottledSignalPageComponent {
  sourceCode = `import { Signal, effect, signal } from '@angular/core';
import throttle from 'lodash-es/throttle';

/*
 * Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value
 * immediately and then waits for the throttle period before emitting subsequent values.
 *
 * @param sourceSignal - The source signal to throttle.
 * @param delayMs - The throttle delay in milliseconds (default: 300).
 *
 * Example:
 *
 * const searchInputText = signal('');
 *
 * // Create a throttled signal for searchInputText
 * const throttledSearchInputText = useThrottledSignal(searchInputText, 500);
 */
export function useThrottledSignal<T>(sourceSignal: Signal<T>, delayMs: number = 300): Signal<T> {
  const throttledSignal = signal<T>(sourceSignal());

  const throttledUpdate = throttle((value: T) => {
    throttledSignal.set(value);
  }, delayMs);

  effect(() => {
    const value = sourceSignal();
    throttledUpdate(value);
  });

  return throttledSignal.asReadonly();
}
`;
}
