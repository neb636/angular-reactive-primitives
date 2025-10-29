# useRouteFragment

Exposes the route fragment (the part after #) as a signal. This is useful for implementing smooth scrolling to sections, deep linking, or tracking which section of a page is active.

## Usage

### Scroll to Section on Load

```ts
import { Component, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useRouteFragment } from 'angular-reactive-primitives';

@Component({
  selector: 'scrollable-page',
  template: `
    <nav>
      <a [routerLink]="[]" fragment="intro">Introduction</a>
      <a [routerLink]="[]" fragment="features">Features</a>
      <a [routerLink]="[]" fragment="pricing">Pricing</a>
    </nav>

    <section id="intro">
      <h2>Introduction</h2>
      <p>Welcome to our product...</p>
    </section>

    <section id="features">
      <h2>Features</h2>
      <p>Our amazing features...</p>
    </section>

    <section id="pricing">
      <h2>Pricing</h2>
      <p>Choose your plan...</p>
    </section>
  `,
})
export class ScrollablePageComponent {
  fragment = useRouteFragment();
  private document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const fragmentValue = this.fragment();
      if (fragmentValue) {
        this.scrollToFragment(fragmentValue);
      }
    });
  }

  private scrollToFragment(fragment: string) {
    const element = this.document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
```

### Active Section Highlighting

```ts
import { Component, computed } from '@angular/core';
import { useRouteFragment } from 'angular-reactive-primitives';

@Component({
  selector: 'documentation-nav',
  template: `
    <nav class="doc-nav">
      @for (section of sections; track section.id) {
        <a
          [routerLink]="[]"
          [fragment]="section.id"
          [class.active]="isActive(section.id)"
        >
          {{ section.label }}
        </a>
      }
    </nav>
  `,
  styles: [
    `
      .doc-nav a.active {
        color: #3b82f6;
        font-weight: 600;
        border-left: 3px solid #3b82f6;
      }
    `,
  ],
})
export class DocumentationNavComponent {
  fragment = useRouteFragment();

  sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Usage' },
    { id: 'api', label: 'API Reference' },
    { id: 'examples', label: 'Examples' },
  ];

  isActive(sectionId: string): boolean {
    return this.fragment() === sectionId;
  }
}
```

### Tab Navigation with Fragment

```ts
import { Component, computed } from '@angular/core';
import { useRouteFragment } from 'angular-reactive-primitives';

type TabId = 'overview' | 'details' | 'reviews';

@Component({
  selector: 'tabbed-content',
  template: `
    <div class="tabs">
      <button
        [routerLink]="[]"
        fragment="overview"
        [class.active]="activeTab() === 'overview'"
      >
        Overview
      </button>
      <button
        [routerLink]="[]"
        fragment="details"
        [class.active]="activeTab() === 'details'"
      >
        Details
      </button>
      <button
        [routerLink]="[]"
        fragment="reviews"
        [class.active]="activeTab() === 'reviews'"
      >
        Reviews
      </button>
    </div>

    <div class="tab-content">
      @switch (activeTab()) {
        @case ('overview') {
          <overview-tab />
        }
        @case ('details') {
          <details-tab />
        }
        @case ('reviews') {
          <reviews-tab />
        }
      }
    </div>
  `,
})
export class TabbedContentComponent {
  fragment = useRouteFragment();

  activeTab = computed<TabId>(() => {
    const frag = this.fragment();
    if (frag === 'details' || frag === 'reviews') {
      return frag;
    }
    return 'overview'; // default
  });
}
```
