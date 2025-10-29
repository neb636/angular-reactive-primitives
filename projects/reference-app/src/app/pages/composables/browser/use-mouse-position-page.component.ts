import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-mouse-position-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useMousePosition</ng-container>

      <ng-container documentation-description>
        Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Cursor Follower" [code]="code_usage_0" />

        <code-block title="Interactive Parallax Effect" [code]="code_usage_1" />

        <code-block title="Drawing Application" [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useMousePosition Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseMousePositionPageComponent {
  code_usage_0 = `import { Component } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'cursor-follower',
  template: \`
    <div class="container">
      <div
        class="follower"
        [style.left.px]="mousePosition().x"
        [style.top.px]="mousePosition().y"
      ></div>
      <div class="coordinates">
        X: {{ mousePosition().x }}, Y: {{ mousePosition().y }}
      </div>
    </div>
  \`,
  styles: [
    \`
      .follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }
    \`,
  ],
})
export class CursorFollowerComponent {
  mousePosition = useMousePosition();
}`;

  code_usage_1 = `import { Component, computed } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'parallax-card',
  template: \`
    <div class="card" [style.transform]="cardTransform()">
      <h2>Hover over me!</h2>
      <p>Move your mouse around</p>
    </div>
  \`,
  styles: [
    \`
      .card {
        width: 300px;
        height: 200px;
        padding: 2rem;
        border-radius: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transition: transform 0.1s ease-out;
      }
    \`,
  ],
})
export class ParallaxCardComponent {
  mousePosition = useMousePosition(50);

  cardTransform = computed(() => {
    const { x, y } = this.mousePosition();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    return \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
  });
}`;

  code_usage_2 = `import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'drawing-app',
  template: \`
    <canvas
      #canvas
      width="800"
      height="600"
      (mousedown)="startDrawing()"
      (mouseup)="stopDrawing()"
    ></canvas>
    <button (click)="clearCanvas()">Clear</button>
  \`,
})
export class DrawingAppComponent {
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  mousePosition = useMousePosition(16);
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    effect(() => {
      if (!this.isDrawing) return;

      const canvasEl = this.canvas()?.nativeElement;
      if (!canvasEl) return;

      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      const { x, y } = this.mousePosition();
      const rect = canvasEl.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;

      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(canvasX, canvasY);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      this.lastX = canvasX;
      this.lastY = canvasY;
    });
  }

  startDrawing() {
    this.isDrawing = true;
    const { x, y } = this.mousePosition();
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    const canvasEl = this.canvas()?.nativeElement;
    const ctx = canvasEl?.getContext('2d');
    if (ctx && canvasEl) {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
  }
}`;

  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useThrottledSignal } from '../../general/use-throttled-signal/use-throttled-signal.composable';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

export type MousePosition = {
  x: number;
  y: number;
};

/*
 * Creates signals that track the mouse position (x and y coordinates). The signals update
 * when the mouse moves, with throttling to prevent excessive updates.
 */
export const useMousePosition = createSharedComposable((throttleMs = 100) => {
  const document = inject(DOCUMENT);
  const mousePosition = signal<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) =>
    mousePosition.set({ x: event.clientX, y: event.clientY });

  document.defaultView?.addEventListener('mousemove', handleMouseMove);

  return {
    value: useThrottledSignal(mousePosition, throttleMs),
    cleanup: () => {
      document.defaultView?.removeEventListener('mousemove', handleMouseMove);
    },
  };
});
`;
}
