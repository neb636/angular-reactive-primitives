# useRouteFragment

Exposes the route fragment (the part after #) as a signal. This is useful for implementing smooth scrolling to sections, deep linking, or tracking which section of a page is active.

## Usage

```ts
import { Component, computed } from '@angular/core';
import { useRouteFragment } from 'angular-reactive-primitives';

@Component({
  selector: 'tabbed-content',
  template: `
    <nav>
      <a routerLink="/docs" fragment="introduction">Introduction</a>
      <a routerLink="/docs" fragment="installation">Installation</a>
      <a routerLink="/docs" fragment="usage">Usage</a>
    </nav>

    <section>
      @switch (fragment()) {
        @case ('introduction') {
          <introduction-tab />
        }
        @case ('installation') {
          installation-tab />
        }
        @case ('usage') {
          <usage-tab />
        }
      }
    </section>
  `,
})
export class TabbedContentComponent {
  fragment = useRouteFragment();
}
```
