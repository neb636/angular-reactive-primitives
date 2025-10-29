# useWindowSize

Creates signals that track the window size (width and height). The signals update when the window is resized, with debouncing to prevent excessive updates.

## Usage

### Responsive Component Sizing

```ts
import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-grid',
  template: `
    <div class="grid" [attr.data-columns]="gridColumns()">
      @for (item of items; track item.id) {
        <div class="grid-item">{{ item.title }}</div>
      }
    </div>
    <div class="info">
      Window: {{ windowSize().width }}x{{ windowSize().height }} ({{
        gridColumns()
      }}
      columns)
    </div>
  `,
})
export class ResponsiveGridComponent {
  windowSize = useWindowSize();
  items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
  }));

  gridColumns = computed(() => {
    const width = this.windowSize().width;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  });
}
```

### Conditional Rendering Based on Size

```ts
import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'size-aware',
  template: `
    @if (showFullFeatures()) {
      <full-dashboard />
    } @else {
      <compact-dashboard />
    }

    @if (isExtraSmall()) {
      <mobile-menu />
    }
  `,
})
export class SizeAwareComponent {
  windowSize = useWindowSize();

  isExtraSmall = computed(() => this.windowSize().width < 480);
  showFullFeatures = computed(
    () => this.windowSize().width >= 1024 && this.windowSize().height >= 768,
  );
}
```

### Canvas Resizing

```ts
import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-canvas',
  template: ` <canvas #canvas></canvas> `,
})
export class ResponsiveCanvasComponent {
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  windowSize = useWindowSize();

  constructor() {
    effect(() => {
      const canvasEl = this.canvas()?.nativeElement;
      if (!canvasEl) return;

      const { width, height } = this.windowSize();

      // Update canvas size
      canvasEl.width = width * 0.8;
      canvasEl.height = height * 0.6;

      // Redraw canvas content
      this.drawCanvas(canvasEl);
    });
  }

  private drawCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw something based on canvas size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
```
