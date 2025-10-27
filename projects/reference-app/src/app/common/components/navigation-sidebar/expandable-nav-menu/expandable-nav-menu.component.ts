import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';
import { Route } from '@angular/router';

@Component({
  selector: 'expandable-nav-menu',
  styleUrls: ['./expandable-nav-menu.component.css'],
  imports: [NavigationItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="expandable-nav-menu">
      @for (section of sections(); track section.path) {
        <div class="expandable-nav-menu__section">
          <button
            class="expandable-nav-menu__section-header"
            (click)="toggleSection(section.path || '')"
            type="button"
          >
            <span class="expandable-nav-menu__section-title">{{
              getSectionTitle(section.path)
            }}</span>
            <svg
              class="expandable-nav-menu__chevron-icon"
              [class.expandable-nav-menu__chevron-icon--expanded]="
                isSectionExpanded(section.path || '')
              "
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
            <div class="expandable-nav-menu__list">
              @for (item of section.children; track item.path) {
                <navigation-item [route]="item" [basePath]="section.path || ''"></navigation-item>
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
})
export class ExpandableNavMenuComponent {
  sections = input.required<Route[]>();

  private expandedSections = signal<Set<string>>(new Set(['getting-started', 'composables', 'effects', 'utils']));

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
