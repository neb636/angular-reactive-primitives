# useMousePosition

Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.

## Usage

### Cursor Follower

```ts
import { Component } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'cursor-follower',
  template: `
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
  `,
  styles: [
    `
      .follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class CursorFollowerComponent {
  mousePosition = useMousePosition();
}
```

### Interactive Parallax Effect

```ts
import { Component, computed } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'parallax-card',
  template: `
    <div class="card" [style.transform]="cardTransform()">
      <h2>Hover over me!</h2>
      <p>Move your mouse around</p>
    </div>
  `,
  styles: [
    `
      .card {
        width: 300px;
        height: 200px;
        padding: 2rem;
        border-radius: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transition: transform 0.1s ease-out;
      }
    `,
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

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
}
```

### Drawing Application

```ts
import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'drawing-app',
  template: `
    <canvas
      #canvas
      width="800"
      height="600"
      (mousedown)="startDrawing()"
      (mouseup)="stopDrawing()"
    ></canvas>
    <button (click)="clearCanvas()">Clear</button>
  `,
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
}
```
