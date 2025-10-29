# useDocumentVisibility

Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.

## Usage

```ts
import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'video-player',
  template: `<video #videoEl src="https://example.com/video.mp4"></video> `,
})
export class VideoPlayerComponent {
  videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  isVisible = useDocumentVisibility();

  constructor() {
    // Pause video when tab no longer in view
    effect(() => {
      const video = this.videoEl()?.nativeElement;

      if (this.isVisible()) {
        video.play();
      } else {
        video.pause();
      }
    });
  }
}
```
