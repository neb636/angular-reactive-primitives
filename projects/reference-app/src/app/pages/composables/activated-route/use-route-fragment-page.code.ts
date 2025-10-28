export const sourceCode = `import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteFragment = () => {
  const route = inject(ActivatedRoute);

  return toSignal(route.fragment, { initialValue: route.snapshot.fragment });
};`;

export const exampleCode = `import { Component, effect, ElementRef, viewChild } from '@angular/core';
import { useRouteFragment } from '@angular/reactive-primitives';

@Component({
  selector: 'documentation-page',
  template: \`
    <div>
      <nav>
        <a routerLink="." fragment="overview">Overview</a>
        <a routerLink="." fragment="installation">Installation</a>
        <a routerLink="." fragment="usage">Usage</a>
      </nav>

      @if (fragment()) {
        <p>Current section: {{ fragment() }}</p>
      }

      <section #overview id="overview">
        <h2>Overview</h2>
        <p>Content...</p>
      </section>

      <section #installation id="installation">
        <h2>Installation</h2>
        <p>Content...</p>
      </section>

      <section #usage id="usage">
        <h2>Usage</h2>
        <p>Content...</p>
      </section>
    </div>
  \`
})
export class DocumentationPageComponent {
  fragment = useRouteFragment();

  constructor() {
    // Automatically scroll to the section when fragment changes
    effect(() => {
      const currentFragment = this.fragment();
      if (currentFragment) {
        const element = document.getElementById(currentFragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}

// URL examples:
// /docs#overview
// /docs#installation
// /docs#usage`;
