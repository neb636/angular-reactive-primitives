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

        <code-block [code]="code_usage_0" />
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
  code_usage_0 = `import { Component, effect, viewChild, ElementRef } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  selector: 'video-player',
  template: \`<video #videoEl src="https://example.com/video.mp4"></video> \`,
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
