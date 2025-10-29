# useMediaQuery

Creates a signal that tracks whether a media query matches. The signal updates when the media query match state changes (e.g., window resize, orientation change).

## Usage

### Responsive Layout

```ts
import { Component } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'responsive-layout',
  template: `
    <div [class.mobile]="isMobile()" [class.desktop]="!isMobile()">
      @if (isMobile()) {
        <mobile-nav />
        <mobile-content />
      } @else {
        <desktop-sidebar />
        <desktop-content />
      }
    </div>
  `,
})
export class ResponsiveLayoutComponent {
  isMobile = useMediaQuery('(max-width: 768px)');
}
```

### Dark Mode Detection

```ts
import { Component, effect } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'theme-aware',
  template: `
    <div [attr.data-theme]="isDarkMode() ? 'dark' : 'light'">
      <h1>Current theme: {{ isDarkMode() ? 'Dark' : 'Light' }}</h1>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `,
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
}
```

### Multiple Media Queries

```ts
import { Component, computed } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'multi-breakpoint',
  template: `
    <div>
      <p>Screen size: {{ screenSize() }}</p>
      <p>Orientation: {{ isLandscape() ? 'Landscape' : 'Portrait' }}</p>
      <p>Reduced motion: {{ prefersReducedMotion() ? 'Yes' : 'No' }}</p>
    </div>
  `,
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
}
```

### Print Detection

```ts
import { Component, effect } from '@angular/core';
import { useMediaQuery } from 'angular-reactive-primitives';

@Component({
  selector: 'print-aware',
  template: `
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
  `,
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
}
```
