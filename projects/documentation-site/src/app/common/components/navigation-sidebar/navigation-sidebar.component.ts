import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NAVIGATION_ROUTES } from '../../../app.routes';
import { ExpandableNavMenuComponent } from './expandable-nav-menu/expandable-nav-menu.component';

@Component({
  selector: 'navigation-sidebar',
  imports: [ExpandableNavMenuComponent],
  template: `
    <aside class="navigation-sidebar">
      <div class="search-container">
        <svg
          class="search-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 14L11.1 11.1"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search anything..."
          class="search-input"
        />
      </div>

      <nav class="navigation-sidebar__menu-container">
        @for (section of NAVIGATION_ROUTES; track section.path) {
          <expandable-nav-menu [section]="section"></expandable-nav-menu>
        }
      </nav>
    </aside>
  `,
  styleUrls: ['./navigation-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {
  readonly NAVIGATION_ROUTES = NAVIGATION_ROUTES;
}
