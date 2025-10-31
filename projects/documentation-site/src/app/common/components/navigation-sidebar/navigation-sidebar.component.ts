import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Route } from '@angular/router';
import { useThrottledSignal } from 'angular-reactive-primitives';
import { NAVIGATION_ROUTES } from '../../../app.routes';
import { ExpandableNavMenuComponent } from './expandable-nav-menu/expandable-nav-menu.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'navigation-sidebar',
  imports: [ExpandableNavMenuComponent, FormsModule],
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
          [(ngModel)]="searchQuery"
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
  throttledQuery = useThrottledSignal(this.searchQuery, 400);

  filteredRoutes = computed(() => {
    const query = this.throttledQuery().toLowerCase().trim();

    if (!query) {
      return NAVIGATION_ROUTES;
    }

    return NAVIGATION_ROUTES.map((section) => {
      // Filter children recursively, keeping categories with matching leaf nodes
      const filteredChildren = this.filterChildren(
        section.children || [],
        query,
      );

      // Include section if it has filtered children
      if (filteredChildren.length > 0) {
        return {
          ...section,
          children: filteredChildren,
        };
      }

      // Return null for sections with no matching children (will be filtered out)
      return null;
    }).filter((section) => section !== null) as Route[];
  });

  private filterChildren(children: Route[], query: string): Route[] {
    return children
      .map((child) => {
        const isLeaf = !!child.component;

        if (isLeaf) {
          // For leaf nodes, check if they match the query
          const childTitle = ((child.title as string) || '').toLowerCase();
          const childPath = (child.path || '').toLowerCase();
          const matches =
            childTitle.includes(query) || childPath.includes(query);
          return matches ? child : null;
        } else if (child.children) {
          // For categories, recursively filter their children
          const filteredSubchildren = this.filterChildren(
            child.children,
            query,
          );
          // Keep category only if it has matching children
          return filteredSubchildren.length > 0
            ? {
                ...child,
                children: filteredSubchildren,
              }
            : null;
        }

        return null;
      })
      .filter((child) => child !== null) as Route[];
  }
}
