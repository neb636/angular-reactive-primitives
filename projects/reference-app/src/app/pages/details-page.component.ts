import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { useParameter } from 'reactive-primitives';
import { syncQueryParamsEffect } from 'reactive-primitives';

@Component({
  standalone: true,
  selector: 'app-details-page',
  imports: [RouterLink],
  template: `
    <div class="panel">
      <h2 style="margin-top: 0">Details</h2>
      <p>Route param id: <strong>{{ id() }}</strong></p>

      <div style="display:flex; gap:8px; align-items:center; margin-top: 12px;">
        <label for="q">Search query:</label>
        <input id="q" [value]="query()" (input)="onQueryInput($event)" placeholder="Type to update ?q=..." />
        <a class="btn secondary" routerLink="/details/7">Go to id 7</a>
      </div>

      <p style="margin-top: 12px; color: var(--muted)">Typing in the input will sync the value to the URL query parameter "q".</p>
    </div>
  `,
})
export class DetailsPageComponent {
  readonly id = useParameter<string>('id');
  readonly query = signal('');

  // Keep the query signal in sync with the URL query params
  readonly _sync = syncQueryParamsEffect({
    queryParams: computed(() => ({ q: this.query() })),
    options: { queryParamsHandling: 'merge' },
  });

  onQueryInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }
}
