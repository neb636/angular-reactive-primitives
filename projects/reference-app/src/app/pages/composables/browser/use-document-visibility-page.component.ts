import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-document-visibility-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useDocumentVisibility</ng-container>

      <ng-container documentation-description>
        Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Activity Tracker" [code]="code_usage_0" />

        <code-block title="Pause Video When Tab Hidden" [code]="code_usage_1" />

        <code-block title="Pause Animations When Hidden" [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useDocumentVisibility Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseDocumentVisibilityPageComponent {
  code_usage_0 = `import { Component, signal, effect } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'activity-tracker',
  template: \`
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
  \`,
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
}`;

  code_usage_1 = `import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'video-player',
  template: \` <video #videoEl [src]="videoUrl" controls></video> \`,
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
}`;

  code_usage_2 = `import { Component, signal, effect } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'animated-dashboard',
  template: \`
    <div class="dashboard">
      @if (animationsEnabled()) {
        <div class="animated-chart"></div>
      } @else {
        <div class="static-chart"></div>
      }
    </div>
  \`,
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
}`;

  sourceCode = `import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { createSharedComposable } from '../../../utils/create-shared-composable/create-shared-composable';

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
export const useDocumentVisibility = createSharedComposable(() => {
  const document = inject(DOCUMENT);

  const visibilitySignal = signal<boolean>(!document.hidden);
  const handleVisibilityChange = () => visibilitySignal.set(!document.hidden);

  // Listen for visibility change events
  document.defaultView?.addEventListener(
    'visibilitychange',
    handleVisibilityChange,
  );

  return {
    value: visibilitySignal.asReadonly(),
    cleanup: () => {
      document.defaultView?.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    },
  };
});
`;
}
