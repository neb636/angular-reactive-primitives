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

      <ng-container documentation-description>
        Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value immediately and then waits for the throttle period before emitting subsequent values.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Scroll Position Tracking" [code]="code_usage_0" />

        <code-block title="Mouse Movement Tracking" [code]="code_usage_1" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useThrottledSignal Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseThrottledSignalPageComponent {
  code_usage_0 = `import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'scroll-tracker',
  template: \`
    <div class="scroll-container" (scroll)="onScroll(\$event)">
      <div class="content">
        <!-- Large scrollable content -->
      </div>
      <div class="scroll-indicator">
        Scroll Position: {{ throttledScrollY() }}px
      </div>
    </div>
  \`,
})
export class ScrollTrackerComponent {
  scrollY = signal(0);
  throttledScrollY = useThrottledSignal(this.scrollY, 100);

  constructor() {
    effect(() => {
      const position = this.throttledScrollY();
      console.log('Throttled scroll position:', position);
      // Perform expensive operations here
    });
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollY.set(target.scrollTop);
  }
}`;

  code_usage_1 = `import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'mouse-follower',
  template: \`
    <div class="tracking-area" (mousemove)="onMouseMove(\$event)">
      <div
        class="follower"
        [style.left.px]="throttledX()"
        [style.top.px]="throttledY()"
      ></div>
    </div>
  \`,
})
export class MouseFollowerComponent {
  mouseX = signal(0);
  mouseY = signal(0);

  throttledX = useThrottledSignal(this.mouseX, 50);
  throttledY = useThrottledSignal(this.mouseY, 50);

  onMouseMove(event: MouseEvent) {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }
}`;

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
