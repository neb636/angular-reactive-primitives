import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { useWindowSize } from 'reactive-primitives';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  template: `
    <section class="grid">
      <div class="card span-8">
        <h2 class="title-tight">Welcome</h2>
        <p class="muted">This is a simple dashboard showcasing the library primitives in action.</p>
        <div class="actions">
          <a routerLink="/details/42" class="btn">Go to Details (id: 42)</a>
          <a routerLink="/settings" class="btn secondary">Open Settings</a>
        </div>
      </div>

      <div class="card span-4">
        <div class="badge">Live</div>
        <h3 class="subtitle-tight">Window size</h3>
        <p class="m-0">Width: {{ width() }}px</p>
        <p class="mt-6">Height: {{ height() }}px</p>
      </div>
    </section>
  `,
  styleUrls: ['./dashboard-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly size = useWindowSize(100);
  readonly width = computed(() => this.size().width);
  readonly height = computed(() => this.size().height);
}
