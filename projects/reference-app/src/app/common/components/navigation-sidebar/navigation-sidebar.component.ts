import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NAVIGATION_ROUTES } from '../../../app.routes';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';

@Component({
  selector: 'navigation-sidebar',
  imports: [NavigationItemComponent],
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
        <input type="text" placeholder="Search anything..." class="search-input" />
      </div>

      <nav class="doc-nav">
        @for (section of NAVIGATION_ROUTES; track section.path) {
          <div class="nav-section">
            <button
              class="nav-section-header"
              (click)="toggleSection(section.path || '')"
              type="button"
            >
              <span class="nav-section-title">{{ getSectionTitle(section.path) }}</span>
              <svg
                class="chevron-icon"
                [class.expanded]="isSectionExpanded(section.path || '')"
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
            @if (isSectionExpanded(section.path || '')) {
              <div class="navigation-sidebar__list">
                @for (item of section.children; track item.path) {
                  <navigation-item [route]="item" [basePath]="section.path || ''"></navigation-item>
                }
              </div>
            }
          </div>
        }
      </nav>
    </aside>
  `,
  styleUrls: ['./navigation-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {
  readonly NAVIGATION_ROUTES = NAVIGATION_ROUTES;

  private expandedSections = signal<Set<string>>(new Set(['getting-started']));

  getSectionTitle(path: string | undefined): string {
    if (!path) return '';
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleSection(path: string): void {
    this.expandedSections.update((sections) => {
      const newSections = new Set(sections);
      if (newSections.has(path)) {
        newSections.delete(path);
      } else {
        newSections.add(path);
      }
      return newSections;
    });
  }

  isSectionExpanded(path: string): boolean {
    return this.expandedSections().has(path);
  }
}
