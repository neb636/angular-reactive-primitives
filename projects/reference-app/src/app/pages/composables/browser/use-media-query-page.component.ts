import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-media-query-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useMediaQuery</ng-container>

      <ng-container documentation-description>
        Creates a signal that tracks whether a media query matches. The signal updates when the media query match state changes (e.g., window resize, orientation change).
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Responsive Layout" [code]="code_usage_0" />

        <code-block title="Dark Mode Detection" [code]="code_usage_1" />

        <code-block title="Multiple Media Queries" [code]="code_usage_2" />

        <code-block title="Print Detection" [code]="code_usage_3" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useMediaQuery Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseMediaQueryPageComponent {
  code_usage_0 = `import { Component } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-layout',
  template: \`
    <div [class.mobile]="isMobile()" [class.desktop]="!isMobile()">
      @if (isMobile()) {
        <mobile-nav />
        <mobile-content />
      } @else {
        <desktop-sidebar />
        <desktop-content />
      }
    </div>
  \`,
})
export class ResponsiveLayoutComponent {
  isMobile = useMediaQuery('(max-width: 768px)');
}`;

  code_usage_1 = `import { Component, effect } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'theme-aware',
  template: \`
    <div [attr.data-theme]="isDarkMode() ? 'dark' : 'light'">
      <h1>Current theme: {{ isDarkMode() ? 'Dark' : 'Light' }}</h1>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  \`,
})
export class ThemeAwareComponent {
  isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  constructor() {
    effect(() => {
      const darkMode = this.isDarkMode();
      document.documentElement.classList.toggle('dark', darkMode);
    });
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
}`;

  code_usage_2 = `import { Component, computed } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'multi-breakpoint',
  template: \`
    <div>
      <p>Screen size: {{ screenSize() }}</p>
      <p>Orientation: {{ isLandscape() ? 'Landscape' : 'Portrait' }}</p>
      <p>Reduced motion: {{ prefersReducedMotion() ? 'Yes' : 'No' }}</p>
    </div>
  \`,
})
export class MultiBreakpointComponent {
  isMobile = useMediaQuery('(max-width: 767px)');
  isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  isDesktop = useMediaQuery('(min-width: 1024px)');
  isLandscape = useMediaQuery('(orientation: landscape)');
  prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  screenSize = computed<ScreenSize>(() => {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  });
}`;

  code_usage_3 = `import { Component, effect } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'print-aware',
  template: \`
    <div>
      @if (isPrinting()) {
        <div class="print-header">
          <h1>Printable Document</h1>
          <p>Date: {{ currentDate }}</p>
        </div>
      }
      <article>
        <!-- Content -->
      </article>
    </div>
  \`,
})
export class PrintAwareComponent {
  isPrinting = useMediaQuery('print');
  currentDate = new Date().toLocaleDateString();

  constructor() {
    effect(() => {
      if (this.isPrinting()) {
        console.log('Document is being printed');
        // Prepare document for printing
      }
    });
  }
}`;

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
}
`;
}
