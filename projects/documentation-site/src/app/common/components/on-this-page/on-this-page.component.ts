import { useRouteFragment } from './../../../../../../reactive-primitives/src/lib/composables/route/use-route-fragment/use-route-fragment.composable';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface PageSection {
  id: string;
  title: string;
}

@Component({
  selector: 'on-this-page',
  styleUrls: ['./on-this-page.component.css'],
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="on-this-page">
      <h2 class="on-this-page__title">ON THIS PAGE</h2>
      <ul class="on-this-page__list">
        @for (section of sections(); track section.id) {
          <li class="on-this-page__item">
            <a
              class="on-this-page__link"
              [class.on-this-page__link--active]="
                routeFragment() === section.id
              "
              [routerLink]="[]"
              [fragment]="section.id"
            >
              {{ section.title }}
            </a>
          </li>
        }
      </ul>
      @if (sections().length > 0) {
        <button class="on-this-page__back-to-top" (click)="scrollToTop()">
          ↑ Back to top
        </button>
      }
    </nav>
  `,
})
export class OnThisPageComponent {
  routeFragment = useRouteFragment();

  sections = input<PageSection[]>([]);

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
