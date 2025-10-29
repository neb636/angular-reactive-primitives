import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-window-size-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useWindowSize</ng-container>

      <ng-container documentation-description>
        Creates signals that track the window size (width and height). The signals update when the window is resized, with debouncing to prevent excessive updates.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Responsive Component Sizing" [code]="code_usage_0" />

        <code-block title="Conditional Rendering Based on Size" [code]="code_usage_1" />

        <code-block title="Canvas Resizing" [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useWindowSize Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseWindowSizePageComponent {
  code_usage_0 = `import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-grid',
  template: \`
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
  \`,
})
export class ResponsiveGridComponent {
  windowSize = useWindowSize();
  items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: \`Item \${i + 1}\`,
  }));

  gridColumns = computed(() => {
    const width = this.windowSize().width;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  });
}`;

  code_usage_1 = `import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'size-aware',
  template: \`
    @if (showFullFeatures()) {
      <full-dashboard />
    } @else {
      <compact-dashboard />
    }

    @if (isExtraSmall()) {
      <mobile-menu />
    }
  \`,
})
export class SizeAwareComponent {
  windowSize = useWindowSize();

  isExtraSmall = computed(() => this.windowSize().width < 480);
  showFullFeatures = computed(
    () => this.windowSize().width >= 1024 && this.windowSize().height >= 768,
  );
}`;

  code_usage_2 = `import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-canvas',
  template: \` <canvas #canvas></canvas> \`,
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
}`;

  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useDebouncedSignal } from '../../general/use-debounced-signal/use-debounced-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type WindowSize = {
  width: number;
  height: number;
};

/*
 * Creates signals that track the window size (width and height). The signals update
 * when the window is resized, with debouncing to prevent excessive updates.
 *
 * @param debounceMs - Debounce delay for resize events (default: 100ms)
 *
 * Example:
 *
 * const windowSize = useWindowSize();
 * const { width, height } = windowSize();
 */
export const useWindowSize = createSharedComposable(
  (debounceMs: number = 100) => {
    const document = inject(DOCUMENT);

    const getWindowSize = (): WindowSize => ({
      width: document.defaultView!.innerWidth,
      height: document.defaultView!.innerHeight,
    });

    const windowSizeSignal = signal<WindowSize>(getWindowSize());
    const handleResize = () => windowSizeSignal.set(getWindowSize());

    // Listen for resize events
    document.defaultView?.addEventListener('resize', handleResize);

    // Debounce the signal to prevent excessive updates
    return {
      value: useDebouncedSignal(windowSizeSignal, debounceMs),
      cleanup: () => {
        document.defaultView?.removeEventListener('resize', handleResize);
      },
    };
  },
);
`;
}
