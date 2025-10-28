import { DocMetadata, DocEntry } from '../doc-metadata.type';
import sourceCodeRaw from './use-throttled-signal.composable.ts?raw';

export const metadata: DocMetadata = {
  name: 'useThrottledSignal',
  title: 'useThrottledSignal',
  description:
    'Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value immediately and then waits for the throttle period before emitting subsequent values.',
  category: 'composables',
  subcategory: 'general',
  parameters: [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to throttle',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'The throttle delay in milliseconds',
      optional: true,
      defaultValue: '300',
    },
  ],
  returnType: 'Signal<T>',
  returnDescription: 'A readonly signal that emits the throttled value',
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = `import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from 'reactive-primitives';

@Component({
  selector: 'scroll-tracker',
  template: \`
    <div class="scroll-container" (scroll)="onScroll($event)">
      <div class="content">
        <!-- Large scrollable content -->
      </div>
      <div class="scroll-indicator">
        Scroll Position: {{ throttledScrollY() }}px
      </div>
    </div>
  \`
})
export class ScrollTrackerComponent {
  scrollY = signal(0);
  
  // Throttle scroll updates to avoid performance issues
  throttledScrollY = useThrottledSignal(this.scrollY, 100);

  constructor() {
    effect(() => {
      const position = this.throttledScrollY();
      console.log('Throttled scroll position:', position);
      // Perform expensive operations here without overwhelming the system
    });
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollY.set(target.scrollTop);
  }
}`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
