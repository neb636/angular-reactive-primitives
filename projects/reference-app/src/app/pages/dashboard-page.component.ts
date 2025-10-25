import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { useWindowSize } from 'reactive-primitives';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  template: `
    <section class="grid">
      <div class="card" style="grid-column: span 8">
        <h2 style="margin: 0 0 8px 0">Welcome</h2>
        <p class="muted">This is a simple dashboard showcasing the library primitives in action.</p>
        <div style="margin-top: 12px; display: flex; gap: 8px; align-items: center;">
          <a routerLink="/details/42" class="btn">Go to Details (id: 42)</a>
          <a routerLink="/settings" class="btn secondary">Open Settings</a>
        </div>
      </div>

      <div class="card" style="grid-column: span 4">
        <div class="badge">Live</div>
        <h3 style="margin: 8px 0 6px 0">Window size</h3>
        <p style="margin: 0">Width: {{ width() }}px</p>
        <p style="margin: 6px 0 0 0">Height: {{ height() }}px</p>
      </div>
    </section>
  `,
})
export class DashboardPageComponent {
  private readonly size = useWindowSize(100);
  readonly width = computed(() => this.size().width);
  readonly height = computed(() => this.size().height);
}
