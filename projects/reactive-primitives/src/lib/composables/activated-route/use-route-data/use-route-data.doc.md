# useRouteData

Exposes route data as a signal-based object. This is useful when you need to access route data reactively, such as for permissions, page titles, or custom metadata attached to routes.

## Usage

### Access Route Data

```ts
import { Component, computed } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  title: string;
  requiresAuth: boolean;
  roles?: string[];
}

@Component({
  selector: 'page-header',
  template: `
    <header>
      <h1>{{ routeData().title }}</h1>
      @if (routeData().requiresAuth) {
        <span class="badge">Protected</span>
      }
    </header>
  `,
})
export class PageHeaderComponent {
  routeData = useRouteData<RouteData>();
}
```

### Route Configuration

```ts
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      title: 'Admin Dashboard',
      requiresAuth: true,
      roles: ['admin', 'moderator'],
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'User Profile',
      requiresAuth: true,
    },
  },
];
```

### Permission-Based Rendering

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  permissions?: string[];
  minimumRole?: string;
}

@Component({
  selector: 'protected-content',
  template: `
    @if (hasAccess()) {
      <div class="content">
        <ng-content></ng-content>
      </div>
    } @else {
      <div class="no-access">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this content.</p>
      </div>
    }
  `,
})
export class ProtectedContentComponent {
  routeData = useRouteData<RouteData>();
  private authService = inject(AuthService);

  hasAccess = computed(() => {
    const data = this.routeData();
    const userPermissions = this.authService.permissions();

    if (!data.permissions) return true;

    return data.permissions.some((p) => userPermissions.includes(p));
  });
}
```

### Breadcrumb Generation

```ts
import { Component, computed } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  breadcrumb?: string;
  icon?: string;
}

@Component({
  selector: 'breadcrumbs',
  template: `
    <nav class="breadcrumbs">
      @for (crumb of breadcrumbs(); track $index) {
        <span class="breadcrumb">
          @if (crumb.icon) {
            <i [class]="crumb.icon"></i>
          }
          {{ crumb.label }}
        </span>
        @if (!$last) {
          <span class="separator">/</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbsComponent {
  routeData = useRouteData<RouteData>();

  breadcrumbs = computed(() => {
    const data = this.routeData();
    return [
      { label: 'Home', icon: 'home-icon' },
      { label: data.breadcrumb || 'Current Page', icon: data.icon },
    ];
  });
}
```
