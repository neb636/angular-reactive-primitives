import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-route-data-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteData</ng-container>

      <ng-container documentation-description>
        Exposes route data as a signal-based object. This is useful when you need to access route data reactively, such as for permissions, page titles, or custom metadata attached to routes.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block title="Access Route Data" [code]="code_usage_0" />

        <code-block title="Route Configuration" [code]="code_usage_1" />

        <code-block title="Permission-Based Rendering" [code]="code_usage_2" />

        <code-block title="Breadcrumb Generation" [code]="code_usage_3" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteData Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseRouteDataPageComponent {
  code_usage_0 = `import { Component, computed } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  title: string;
  requiresAuth: boolean;
  roles?: string[];
}

@Component({
  selector: 'page-header',
  template: \`
    <header>
      <h1>{{ routeData().title }}</h1>
      @if (routeData().requiresAuth) {
        <span class="badge">Protected</span>
      }
    </header>
  \`,
})
export class PageHeaderComponent {
  routeData = useRouteData<RouteData>();
}`;

  code_usage_1 = `// app.routes.ts
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
];`;

  code_usage_2 = `import { Component, computed, inject } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  permissions?: string[];
  minimumRole?: string;
}

@Component({
  selector: 'protected-content',
  template: \`
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
  \`,
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
}`;

  code_usage_3 = `import { Component, computed } from '@angular/core';
import { useRouteData } from 'angular-reactive-primitives';

interface RouteData {
  breadcrumb?: string;
  icon?: string;
}

@Component({
  selector: 'breadcrumbs',
  template: \`
    <nav class="breadcrumbs">
      @for (crumb of breadcrumbs(); track \$index) {
        <span class="breadcrumb">
          @if (crumb.icon) {
            <i [class]="crumb.icon"></i>
          }
          {{ crumb.label }}
        </span>
        @if (!\$last) {
          <span class="separator">/</span>
        }
      }
    </nav>
  \`,
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
}`;

  sourceCode = `import { inject, Signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useRouteData = <T extends { [key: string]: any }>() => {
  const route = inject(ActivatedRoute);
  const routeData = toSignal(route.data, { initialValue: route.snapshot.data }) as Signal<T>;

  return computed(() => routeData() || ({} as T));
};
`;
}
