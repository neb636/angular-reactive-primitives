import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Route } from '@angular/router';

@Component({
  selector: 'navigation-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    @if (!hasChildren()) {
      <li>
        <a
          [routerLink]="fullPath()"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: exactMatch() }"
        >
          {{ label() }}
        </a>
      </li>
    } @else {
      <li class="nav-subsection">
        <span class="nav-subtitle" (click)="toggleChildren()">
          {{ label() }}
          <span class="expand-icon">{{ expandIcon() }}</span>
        </span>
        @if (childrenOpen()) {
          <ul class="nav-sublist">
            @for (child of route().children; track child.path) {
              <navigation-item
                [route]="child"
                [basePath]="fullPath()"
              ></navigation-item>
            }
          </ul>
        }
      </li>
    }
  `,
  styleUrls: ['./navigation-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationItemComponent {
  route = input.required<Route>();
  basePath = input<string>('');

  childrenOpen = signal(false);

  hasChildren = computed(() => {
    const r = this.route();
    return !!r.children && r.children.length > 0 && !r.component;
  });

  fullPath = computed(() => {
    const base = this.basePath();
    const path = this.route().path || '';
    return base ? `${base}/${path}` : path;
  });

  label = computed(() => {
    return this.route().title as string || this.route().path || '';
  });

  exactMatch = computed(() => {
    return this.fullPath() === '';
  });

  expandIcon = computed(() => {
    return this.childrenOpen() ? '−' : '+';
  });

  toggleChildren() {
    this.childrenOpen.update(open => !open);
  }
}
