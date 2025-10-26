import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Route } from '@angular/router';

@Component({
  selector: 'navigation-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    @if (!hasChildren()) {
      <div>
        <a
          [routerLink]="fullPath()"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: exactMatch() }"
        >
          {{ label() }}
        </a>
      </div>
    } @else {
      <div class="nav-subsection">
        <button class="nav-subtitle" (click)="toggleChildren()" type="button">
          <span class="nav-subtitle-text">{{ label() }}</span>
          <svg
            class="chevron-icon"
            [class.expanded]="childrenOpen()"
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
        @if (childrenOpen()) {
          <div class="nav-sublist">
            @for (child of route().children; track child.path) {
              <navigation-item [route]="child" [basePath]="fullPath()"></navigation-item>
            }
          </div>
        }
      </div>
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
    return (this.route().title as string) || this.route().path || '';
  });

  exactMatch = computed(() => {
    return this.fullPath() === '';
  });

  toggleChildren() {
    this.childrenOpen.update((open) => !open);
  }
}
