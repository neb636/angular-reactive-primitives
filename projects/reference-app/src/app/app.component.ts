import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from './common/components/navigation-sidebar/navigation-sidebar.component';
import { DocumentationHeaderComponent } from './common/components/documentation-header/documentation-header.component';

@Component({
  selector: 'root',
  imports: [RouterOutlet, DocumentationHeaderComponent, NavigationSidebarComponent],
  template: `
    <div class="app-root">
      <documentation-header />

      <div class="app-root__body">
        <navigation-sidebar />

        <main class="app-root__page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
