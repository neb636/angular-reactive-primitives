import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-window-size-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useWindowSize</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks the window size (width and height). Updates when the window is resized, with debouncing to prevent excessive updates.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useWindowSize composable creates a signal that tracks the current window dimensions.
          The signal automatically updates when the window is resized, returning an object with
          width and height properties.
        </p>
        <p>
          To prevent performance issues from frequent resize events, the signal is debounced by default
          with a 100ms delay. You can customize this delay by providing a different debounce value.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useWindowSize Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseWindowSizePageComponent {
  parameters = [
    {
      name: 'debounceMs',
      type: 'number',
      description: 'Debounce delay for resize events in milliseconds (default: 100)',
    },
  ];

  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useDebouncedSignal } from '../use-debounced-signal.composable';

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
 *
 * // Or get individual dimensions
 * const width = useWindowSize().width;
 * const height = useWindowSize().height;
 */
export function useWindowSize(debounceMs: number = 100): Signal<WindowSize> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);

  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const getWindowSize = (): WindowSize => ({
    width: document.defaultView!.innerWidth,
    height: document.defaultView!.innerHeight,
  });

  const windowSizeSignal = signal<WindowSize>(getWindowSize());

  const handleResize = () => {
    windowSizeSignal.set(getWindowSize());
  };

  // Listen for resize events
  document.defaultView.addEventListener('resize', handleResize);

  // Cleanup listener on destroy
  destroyRef.onDestroy(() => {
    document.defaultView?.removeEventListener('resize', handleResize);
  });

  // Debounce the signal to prevent excessive updates
  return useDebouncedSignal(windowSizeSignal, debounceMs);
}`;

  exampleCode = `import { Component, computed, effect } from '@angular/core';
import { useWindowSize } from '@angular/reactive-primitives';

@Component({
  selector: 'responsive-canvas',
  template: \`
    <div>
      <canvas 
        [width]="canvasSize().width" 
        [height]="canvasSize().height"
      ></canvas>
      <p>Window: {{ windowSize().width }}x{{ windowSize().height }}</p>
      <p>Canvas: {{ canvasSize().width }}x{{ canvasSize().height }}</p>
      @if (isSmallScreen()) {
        <p>Small screen layout active</p>
      }
    </div>
  \`
})
export class ResponsiveCanvasComponent {
  // Track window size with default 100ms debounce
  windowSize = useWindowSize();

  // Or with custom debounce
  windowSizeFast = useWindowSize(50);

  // Compute canvas size based on window size
  canvasSize = computed(() => {
    const { width, height } = this.windowSize();
    return {
      width: Math.min(width * 0.9, 1200),
      height: Math.min(height * 0.7, 800),
    };
  });

  // Check if screen is small
  isSmallScreen = computed(() => this.windowSize().width < 768);

  constructor() {
    effect(() => {
      const { width, height } = this.windowSize();
      console.log(\`Window resized to: \${width}x\${height}\`);
    });
  }
}

// Another example: Adaptive column layout
@Component({
  selector: 'grid-layout',
  template: \`
    <div [style.grid-template-columns]="gridColumns()">
      @for (item of items; track item.id) {
        <div class="grid-item">{{ item.name }}</div>
      }
    </div>
  \`
})
export class GridLayoutComponent {
  windowSize = useWindowSize();

  // Dynamically adjust grid columns based on window width
  gridColumns = computed(() => {
    const width = this.windowSize().width;
    if (width < 640) return 'repeat(1, 1fr)';
    if (width < 1024) return 'repeat(2, 1fr)';
    if (width < 1280) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  });

  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ];
}

// Example: Conditional rendering based on aspect ratio
@Component({
  selector: 'aspect-aware-layout',
  template: \`
    @if (isWideScreen()) {
      <two-column-layout />
    } @else {
      <single-column-layout />
    }
  \`
})
export class AspectAwareLayoutComponent {
  windowSize = useWindowSize();

  isWideScreen = computed(() => {
    const { width, height } = this.windowSize();
    return width / height > 1.5;
  });
}`;
}
