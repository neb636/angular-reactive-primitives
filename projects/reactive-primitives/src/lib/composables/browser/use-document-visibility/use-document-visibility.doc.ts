import { DocMetadata, DocEntry } from '../../../types/doc-metadata.type';
import sourceCodeRaw from './use-document-visibility.composable.ts?raw';

export const metadata: DocMetadata = {
  name: 'useDocumentVisibility',
  title: 'useDocumentVisibility',
  description:
    'Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.',
  category: 'composables',
  subcategory: 'browser',
  parameters: [],
  returnType: 'Signal<boolean>',
  returnDescription:
    'A readonly signal that emits true when the document is visible, false when hidden',
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = `import { Component, effect } from '@angular/core';
import { useDocumentVisibility } from 'reactive-primitives';

@Component({
  selector: 'activity-tracker',
  template: \`
    <div class="activity-tracker">
      @if (isVisible()) {
        <div class="status status--active">
          <span class="indicator"></span>
          Tab is active
        </div>
      } @else {
        <div class="status status--inactive">
          <span class="indicator"></span>
          Tab is inactive
        </div>
      }
      
      <p>You've been away for {{ awayTime() }} seconds</p>
    </div>
  \`
})
export class ActivityTrackerComponent {
  isVisible = useDocumentVisibility();
  awayTime = signal(0);
  
  private intervalId?: number;

  constructor() {
    effect(() => {
      const visible = this.isVisible();
      
      if (!visible) {
        // Start counting when tab becomes hidden
        this.intervalId = window.setInterval(() => {
          this.awayTime.update(t => t + 1);
        }, 1000);
      } else {
        // Clear interval when tab becomes visible
        if (this.intervalId) {
          window.clearInterval(this.intervalId);
          this.awayTime.set(0);
        }
      }
    });
  }
}`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
