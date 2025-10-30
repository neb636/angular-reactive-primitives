import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
@Component({
  selector: 'use-previous-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>usePreviousSignal</ng-container>
      <p>Creates a signal that tracks the previous value of a source signal. Useful for comparing current vs previous state or implementing undo functionality.</p>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsePreviousSignalPageComponent {
  sourceCode = `import { Signal, computed, signal } from '@angular/core';

/*
 * Creates a signal that tracks the previous value of a source signal. Useful for comparing
 * current vs previous state or implementing undo functionality.
 *
 * @param sourceSignal - The source signal to track the previous value of.
 *
 * Example:
 *
 * const currentValue = signal('hello');
 * const previousValue = usePreviousSignal(currentValue);
 *
 * // previousValue() will be undefined initially, then track the previous value
 * console.log(previousValue()); // undefined
 * currentValue.set('world');
 * console.log(previousValue()); // 'hello'
 */
export function usePreviousSignal<T>(sourceSignal: Signal<T>): Signal<T | undefined> {
  const previousSignal = signal<T | undefined>(undefined);
  let lastValue = sourceSignal();

  return computed(() => {
    const currentValue = sourceSignal();

    if (currentValue !== lastValue) {
      previousSignal.set(lastValue);
      lastValue = currentValue;
    }

    return previousSignal();
  });
}
`;
}
