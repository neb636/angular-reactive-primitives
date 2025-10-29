# useDocumentVisibility

Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.

## Usage

### Activity Tracker

```ts
import { Component, signal, effect } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'activity-tracker',
  template: `
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
  `,
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
          this.awayTime.update((t) => t + 1);
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
}
```

### Pause Video When Tab Hidden

```ts
import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'video-player',
  template: ` <video #videoEl [src]="videoUrl" controls></video> `,
})
export class VideoPlayerComponent {
  videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  isVisible = useDocumentVisibility();
  videoUrl = 'https://example.com/video.mp4';

  constructor() {
    effect(() => {
      const video = this.videoEl()?.nativeElement;
      if (!video) return;

      if (this.isVisible()) {
        video.play();
      } else {
        video.pause();
      }
    });
  }
}
```

### Pause Animations When Hidden

```ts
import { Component, signal, effect } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'animated-dashboard',
  template: `
    <div class="dashboard">
      @if (animationsEnabled()) {
        <div class="animated-chart"></div>
      } @else {
        <div class="static-chart"></div>
      }
    </div>
  `,
})
export class AnimatedDashboardComponent {
  isVisible = useDocumentVisibility();
  animationsEnabled = signal(true);
  private animationFrameId?: number;

  constructor() {
    effect(() => {
      const visible = this.isVisible();

      if (visible) {
        this.startAnimations();
      } else {
        this.stopAnimations();
      }
    });
  }

  private startAnimations() {
    this.animationsEnabled.set(true);
    // Start expensive animations
  }

  private stopAnimations() {
    this.animationsEnabled.set(false);
    // Stop to save battery and CPU
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
```
