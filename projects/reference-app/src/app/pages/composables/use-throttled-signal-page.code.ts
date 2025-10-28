export const sourceCode = `import { Signal, effect, signal } from '@angular/core';
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
}`;

export const exampleCode = `import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from '@angular/reactive-primitives';

// Example 1: Throttle scroll position tracking
@Component({
  selector: 'scroll-tracker',
  template: \`
    <div (scroll)="onScroll($event)" style="height: 300px; overflow: auto;">
      <div style="height: 2000px;">
        <p>Scroll position: {{ throttledScrollPosition() }}</p>
        <p>This updates at most once per 500ms</p>
      </div>
    </div>
  \`
})
export class ScrollTrackerComponent {
  scrollPosition = signal(0);
  throttledScrollPosition = useThrottledSignal(this.scrollPosition, 500);

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollPosition.set(target.scrollTop);
  }

  constructor() {
    effect(() => {
      console.log('Throttled scroll position:', this.throttledScrollPosition());
      // This will log at most once per 500ms
    });
  }
}

// Example 2: Throttle rapid button clicks
@Component({
  selector: 'save-button',
  template: \`
    <button (click)="incrementClicks()">
      Save (Clicked {{ clickCount() }} times)
    </button>
    <p>Throttled clicks: {{ throttledClicks() }}</p>
  \`
})
export class SaveButtonComponent {
  clickCount = signal(0);
  throttledClicks = useThrottledSignal(this.clickCount, 1000);

  incrementClicks() {
    this.clickCount.update(count => count + 1);
  }

  constructor() {
    effect(() => {
      const count = this.throttledClicks();
      if (count > 0) {
        console.log('Performing save operation...');
        // This will execute at most once per second
      }
    });
  }
}

// Example 3: Throttle resize events
@Component({
  selector: 'window-tracker',
  template: \`
    <div>
      <p>Window width: {{ windowWidth() }}</p>
      <p>Throttled width: {{ throttledWidth() }}</p>
    </div>
  \`
})
export class WindowTrackerComponent {
  windowWidth = signal(window.innerWidth);
  throttledWidth = useThrottledSignal(this.windowWidth, 200);

  constructor() {
    window.addEventListener('resize', () => {
      this.windowWidth.set(window.innerWidth);
    });

    effect(() => {
      console.log('Throttled width update:', this.throttledWidth());
      // Heavy computation or API call would happen here
      // This executes at most once per 200ms
    });
  }
}`;
