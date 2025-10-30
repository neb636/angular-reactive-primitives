import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';
import { Route } from '@angular/router';

@Component({
  selector: 'expandable-nav-menu',
  styleUrls: ['./expandable-nav-menu.component.css'],
  imports: [NavigationItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="expandable-nav-menu__section">
      <button
        class="expandable-nav-menu__section-header"
        (click)="isExpanded.set(!isExpanded())"
        type="button"
      >
        <span class="expandable-nav-menu__section-title">{{
          section().title
        }}</span>
        <svg
          class="expandable-nav-menu__chevron-icon"
          [class.expandable-nav-menu__chevron-icon--expanded]="isExpanded()"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      @if (isExpanded()) {
        <div class="expandable-nav-menu__list">
          @for (item of section().children; track item.path) {
            <navigation-item
              [route]="item"
              [basePath]="section().path || ''"
            ></navigation-item>
          }
        </div>
      }
    </div>
  `,
})
export class ExpandableNavMenuComponent {
  section = input.required<Route>();

  isExpanded = signal(true);
}
