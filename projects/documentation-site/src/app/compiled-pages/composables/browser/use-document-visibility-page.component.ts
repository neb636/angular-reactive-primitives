import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';
@Component({
  selector: 'use-document-visibility-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDocumentVisibility</ng-container>
      <p>Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.</p>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="codeBlock1" [fileType]="'ts'" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Returns</ng-container>

        <p><code>Signal&lt;boolean&gt;</code></p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Notes</ng-container>

        <p>- Returned signal is <strong>readonly</strong> to prevent direct manipulation</p>

        <p>- Uses <code>createSharedComposable</code> internally so only there is only shared instance at a time and event listeners are torn down when no more subscribers.</p>
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDocumentVisibilityPageComponent {
  codeBlock1 = `import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  template: \`<h1>Tab currently visible: {{ isVisible() }}</h1>\`,
})
class ExampleComponent {
  isVisible = useDocumentVisibility();
}`;
  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

/*
 * Creates a signal that tracks whether the document/tab is visible or hidden.
 * The signal updates when the user switches tabs or minimizes the window.
 *
 * Example:
 *
 * const isVisible = useDocumentVisibility();
 *
 * // Use in template
 * @if (isVisible()) {
 *   <div>Tab is visible</div>
 * } @else {
 *   <div>Tab is hidden</div>
 * }
 */
export const useDocumentVisibility = createSharedComposable(() => {
  const document = inject(DOCUMENT);

  const visibilitySignal = signal<boolean>(!document.hidden);
  const handleVisibilityChange = () => visibilitySignal.set(!document.hidden);

  // Listen for visibility change events
  document.defaultView?.addEventListener(
    'visibilitychange',
    handleVisibilityChange,
  );

  return {
    value: visibilitySignal.asReadonly(),
    cleanup: () => {
      document.defaultView?.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    },
  };
});
`;
}
