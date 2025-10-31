import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { Route } from '@angular/router';
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
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
        />
      </div>

      <nav class="navigation-sidebar__menu-container">
        @for (section of filteredRoutes(); track section.path) {
          <expandable-nav-menu [section]="section"></expandable-nav-menu>
        }
      </nav>
    </aside>
  `,
  styleUrls: ['./navigation-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {
  searchQuery = signal('');

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  filteredRoutes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return NAVIGATION_ROUTES;
    }

    return NAVIGATION_ROUTES.map((section) => {
      const sectionTitle = ((section.title as string) || '').toLowerCase();
      const sectionPath = (section.path || '').toLowerCase();
      const sectionMatches =
        sectionTitle.includes(query) || sectionPath.includes(query);

      // Filter children that match the query
      const matchingChildren =
        section.children?.filter((child) => {
          const childTitle = ((child.title as string) || '').toLowerCase();
          const childPath = (child.path || '').toLowerCase();
          return childTitle.includes(query) || childPath.includes(query);
        }) || [];

      // If section matches, show all children
      if (sectionMatches) {
        return section;
      }

      // If section doesn't match but has matching children, return section with filtered children
      if (matchingChildren.length > 0) {
        return {
          ...section,
          children: matchingChildren,
        };
      }

      // Return null for sections that don't match (will be filtered out)
      return null;
    }).filter((section): section is Route => section !== null);
  });
}
