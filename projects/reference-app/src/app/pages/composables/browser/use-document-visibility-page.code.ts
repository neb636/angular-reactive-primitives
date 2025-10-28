export const sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/*
 * Creates a signal that tracks whether the document/tab is visible or hidden.
 * The signal updates when the user switches tabs or minimizes the window.
 *
 * Example:
 *
 * const isVisible = useDocumentVisibility();
 *
 * // Use in template
 * @if (isVisible()) {
 *   <div>Tab is visible</div>
 * } @else {
 *   <div>Tab is hidden</div>
 * }
 */
export function useDocumentVisibility(): Signal<boolean> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);

  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const visibilitySignal = signal<boolean>(!document.hidden);

  const handleVisibilityChange = () => {
    visibilitySignal.set(!document.hidden);
  };

  // Listen for visibility change events
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup listener on destroy
  destroyRef.onDestroy(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return visibilitySignal.asReadonly();
}`;

export const exampleCode = `import { Component, effect, signal } from '@angular/core';
import { useDocumentVisibility } from '@angular/reactive-primitives';

@Component({
  selector: 'video-player',
  template: \`
    <div>
      <video #videoElement [src]="videoUrl" controls></video>
      @if (!isVisible()) {
        <p>Video paused while tab is hidden</p>
      }
    </div>
  \`
})
export class VideoPlayerComponent {
  isVisible = useDocumentVisibility();
  videoUrl = 'path/to/video.mp4';

  constructor() {
    // Pause video when tab is hidden, resume when visible
    effect(() => {
      const videoElement = document.querySelector('video');
      if (!this.isVisible() && videoElement && !videoElement.paused) {
        videoElement.pause();
        console.log('Video paused: tab is hidden');
      }
    });
  }
}

// Another example: Pause polling when tab is hidden
@Component({
  selector: 'live-dashboard',
  template: \`<div>Last updated: {{ lastUpdate() }}</div>\`
})
export class LiveDashboardComponent {
  isVisible = useDocumentVisibility();
  lastUpdate = signal<Date>(new Date());
  private pollingInterval?: number;

  constructor() {
    effect(() => {
      if (this.isVisible()) {
        // Start polling when visible
        this.pollingInterval = window.setInterval(() => {
          this.fetchData();
        }, 5000);
      } else {
        // Stop polling when hidden
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
        }
      }
    });
  }

  private fetchData() {
    // Fetch latest data
    this.lastUpdate.set(new Date());
  }
}`;
