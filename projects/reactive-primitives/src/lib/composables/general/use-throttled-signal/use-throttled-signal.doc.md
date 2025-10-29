# useThrottledSignal

Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value immediately and then waits for the throttle period before emitting subsequent values.

## Usage

### Scroll Position Tracking

```ts
import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'scroll-tracker',
  template: `
    <div class="scroll-container" (scroll)="onScroll($event)">
      <div class="content">
        <!-- Large scrollable content -->
      </div>
      <div class="scroll-indicator">
        Scroll Position: {{ throttledScrollY() }}px
      </div>
    </div>
  `,
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
}
```

### Mouse Movement Tracking

```ts
import { Component, signal, effect } from '@angular/core';
import { useThrottledSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'mouse-follower',
  template: `
    <div class="tracking-area" (mousemove)="onMouseMove($event)">
      <div
        class="follower"
        [style.left.px]="throttledX()"
        [style.top.px]="throttledY()"
      ></div>
    </div>
  `,
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
}
```
