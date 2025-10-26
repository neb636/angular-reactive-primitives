import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NAVIGATION_ROUTES } from '../../../app.routes';
import { NavigationItemComponent } from '../navigation-item/navigation-item.component';

@Component({
  selector: 'navigation-sidebar',
  imports: [NavigationItemComponent],
  template: `
    <aside class="navigation-sidebar">
      <div class="search-container">
        <input type="text" placeholder="Search Reference..." class="search-input" />
        <span class="search-shortcut">/</span>
      </div>

      <nav class="doc-nav">
        @for (section of NAVIGATION_ROUTES; track section.path) {
          <div class="nav-section">
            <h3 class="nav-title">{{ getSectionTitle(section.path) }}</h3>
            <ul class="nav-list">
              @for (item of section.children; track item.path) {
                <navigation-item [route]="item" [basePath]="section.path || ''"></navigation-item>
              }
            </ul>
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

  getSectionTitle(path: string | undefined): string {
    if (!path) return '';
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
