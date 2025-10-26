import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-media-query-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useMediaQuery</ng-container>

      <ng-container documentation-description
        >Creates a signal that tracks whether a media query matches. Updates when the media query match state changes (e.g., window resize, orientation change).</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The useMediaQuery composable creates a signal that tracks the match state of a CSS media query.
          It returns true when the media query matches and false when it doesn't. The signal automatically
          updates when the match state changes.
        </p>
        <p>
          This is perfect for implementing responsive behavior in your components, detecting dark mode
          preferences, checking device orientation, or any other media query-based logic.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'useMediaQuery Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseMediaQueryPageComponent {
  parameters = [
    {
      name: 'query',
      type: 'string',
      description: 'The media query string to match against (e.g., "(max-width: 768px)")',
    },
  ];

  sourceCode = `import { Signal, signal, effect, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/*
 * Creates a signal that tracks whether a media query matches. The signal will update
 * when the media query match state changes (e.g., window resize, orientation change).
 *
 * @param query - The media query string to match against
 *
 * Example:
 *
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 *
 * // Use in template
 * @if (isDarkMode()) {
 *   <div>Dark mode is active</div>
 * }
 */
export function useMediaQuery(query: string): Signal<boolean> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);

  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const mediaQuery = document.defaultView.matchMedia(query);
  const matchesSignal = signal<boolean>(mediaQuery.matches);

  // Listen for changes to the media query
  const handleChange = (event: MediaQueryListEvent) => {
    matchesSignal.set(event.matches);
  };

  mediaQuery.addEventListener('change', handleChange);

  // Cleanup listener on destroy
  destroyRef.onDestroy(() => {
    mediaQuery.removeEventListener('change', handleChange);
  });

  return matchesSignal.asReadonly();
}`;

  exampleCode = `import { Component, computed } from '@angular/core';
import { useMediaQuery } from '@angular/reactive-primitives';

@Component({
  selector: 'responsive-layout',
  template: \`
    <div [class]="layoutClass()">
      @if (isMobile()) {
        <mobile-navigation />
      } @else {
        <desktop-navigation />
      }

      <main>
        <h1>Responsive Layout</h1>
        @if (isDarkMode()) {
          <p>Dark mode is enabled</p>
        }
        @if (isLandscape()) {
          <p>Device is in landscape orientation</p>
        }
        <p>Current layout: {{ layoutClass() }}</p>
      </main>
    </div>
  \`
})
export class ResponsiveLayoutComponent {
  // Device size queries
  isMobile = useMediaQuery('(max-width: 768px)');
  isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  isDesktop = useMediaQuery('(min-width: 1025px)');

  // Preference queries
  isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Orientation query
  isLandscape = useMediaQuery('(orientation: landscape)');
  isPortrait = useMediaQuery('(orientation: portrait)');

  // Computed layout class based on screen size
  layoutClass = computed(() => {
    if (this.isMobile()) return 'mobile-layout';
    if (this.isTablet()) return 'tablet-layout';
    if (this.isDesktop()) return 'desktop-layout';
    return 'default-layout';
  });

  constructor() {
    // You can react to media query changes
    effect(() => {
      if (this.isDarkMode()) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }
}

// Another example: Conditional data loading
@Component({
  selector: 'image-gallery',
  template: \`
    @for (image of images; track image.id) {
      <img [src]="useHighRes() ? image.highRes : image.lowRes" />
    }
  \`
})
export class ImageGalleryComponent {
  useHighRes = useMediaQuery('(min-width: 1920px)');
  images = [
    { id: 1, lowRes: 'image1-low.jpg', highRes: 'image1-high.jpg' },
    { id: 2, lowRes: 'image2-low.jpg', highRes: 'image2-high.jpg' },
  ];
}`;
}
