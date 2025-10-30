import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
import { SimpleTableComponent } from '../../common/components/simple-table/simple-table.component';
@Component({
  selector: 'use-debounced-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
    SimpleTableComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDebouncedSignal</ng-container>
      <p>Creates a debounced signal from a source signal. Useful for things like search inputs where you want to debounce the input value before making an API call.</p>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="codeBlock1" [fileType]="'html'" />

        <code-block [code]="codeBlock2" [fileType]="'ts'" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Parameters</ng-container>

        <simple-table [rows]="parametersTableRows" [columns]="parametersTableColumns"></simple-table>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Returns</ng-container>

        <p><code>Signal&lt;T&gt;</code> - A readonly signal that updates after the debounce delay</p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Why Use Both Normal and Debounced Signals?</ng-container>

        <p>Having both the original signal and a debounced version allows you to:</p>

        <p>- <strong>Normal signal</strong>: Provide instant UI feedback (character counts, validation messages, visual updates)</p>

        <p>- <strong>Debounced signal</strong>: Trigger expensive operations only after user stops typing (API calls, heavy computations)</p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Debounce vs Throttle</ng-container>

        <simple-table [rows]="debounceVsThrottleRows" [columns]="debounceVsThrottleColumns"></simple-table>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Notes</ng-container>

        <p>- The debounced signal is <strong>readonly</strong> to prevent direct manipulation</p>

        <p>- Initial value of the debounced signal matches the source signal&#39;s initial value</p>

        <p>- Uses lodash&#39;s <code>debounce</code> implementation for reliable behavior</p>

        <p>- The debounce timer resets with each new value from the source signal</p>

        <p>- Consider using <code>useThrottledSignal</code> for continuous events like scrolling or mouse movement</p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDebouncedSignalPageComponent {
  codeBlock1 = `<textarea [(ngModel)]="textareaContent"></textarea>
<p>Characters: {{ textareaContent()?.length || 0 }}</p>

<h3>AI Summary</h3>
<p>{{ aiSummary.data() }}</p>`;
  codeBlock2 = `import { useDebouncedSignal } from 'angular-reactive-primitives';

const textareaContent = signal('');
const debouncedTextareaContent = useDebouncedSignal(textareaContent, 1000);

aiSummary = resource({
  params: () => ({ text: debouncedTextareaContent() }),
  loader: ({ params }) => fetchAISummary(params),
});`;
  parametersTableRows = [["<code>sourceSignal</code>","<code>Signal&lt;T&gt;</code>","_required_","The source signal to debounce"],["<code>delayMs</code>","<code>number</code>","<code>300</code>","The debounce delay in milliseconds"]];
  parametersTableColumns = ["Parameter","Type","Default","Description"];
  debounceVsThrottleRows = [["Waits for &quot;quiet period&quot;","Executes at regular intervals"],["Good for: search, validation","Good for: scroll, resize, mouse move"],["Last value after inactivity","Periodic values during activity"]];
  debounceVsThrottleColumns = ["<strong>Debounce</strong>","<strong>Throttle</strong>"];
  sourceCode = `import { Signal, effect, signal } from '@angular/core';
import debounce from 'lodash-es/debounce';

/*
 * Creates a debounced signal from a source signal. Useful for things like search inputs where
 * you want to debounce the input value before making an API call.
 *
 * @param sourceSignal - The source signal to debounce.
 * @param delayMs - The debounce delay in milliseconds (default: 300).
 *
 * Example:
 *
 * const searchInputText = signal('');
 *
 * // Create a debounced signal for searchInputText
 * const debouncedSearchInputText = useDebouncedSignal(searchInputText, 500);
 */
export function useDebouncedSignal<T>(sourceSignal: Signal<T>, delayMs: number = 300): Signal<T> {
  const debouncedSignal = signal<T>(sourceSignal());

  const debouncedUpdate = debounce((value: T) => {
    debouncedSignal.set(value);
  }, delayMs);

  effect(() => {
    const value = sourceSignal();
    debouncedUpdate(value);
  });

  return debouncedSignal.asReadonly();
}
`;
}
