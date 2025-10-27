import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Route } from '@angular/router';

@Component({
  selector: 'navigation-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    @if (!hasChildren()) {
      <a
        class="navigation-item__leaf"
        [class.navigation-item--is-active]="rla.isActive"
        [routerLink]="fullPath()"
        routerLinkActive
        #rla="routerLinkActive"
        [routerLinkActiveOptions]="{ exact: exactMatch() }"
      >
        {{ label() }}
      </a>
    } @else {
      <div class="navigation-item__subsection">
        <button class="navigation-item__subtitle" (click)="toggleChildren()" type="button">
          <span class="navigation-item__subtitle-text">{{ label() }}</span>
        </button>

        <div class="navigation-item__sublist">
          @for (child of route().children; track child.path) {
            <navigation-item [route]="child" [basePath]="fullPath()"></navigation-item>
          }
        </div>
      </div>
    }
  `,
  styleUrls: ['./navigation-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationItemComponent {
  route = input.required<Route>();
  basePath = input<string>('');
  depth = input<number>(0);

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
