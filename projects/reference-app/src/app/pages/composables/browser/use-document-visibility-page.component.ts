import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-document-visibility-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDocumentVisibility</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks whether the document/tab is visible or hidden. Updates when the user switches tabs or minimizes the window.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useDocumentVisibility composable creates a signal that tracks the visibility state of
          the document. It returns true when the tab/window is visible and false when it's hidden
          (minimized, switched to another tab, etc.).
        </p>
        <p>
          This is particularly useful for pausing animations, stopping expensive operations, or
          handling real-time updates differently when the user isn't actively viewing your application.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useDocumentVisibility Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDocumentVisibilityPageComponent {
  parameters = [
    {
      name: 'None',
      type: 'N/A',
      description: 'This composable takes no parameters',
    },
  ];

  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
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

  exampleCode = `import { Component, effect, signal } from '@angular/core';
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
}
