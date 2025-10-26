import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { useParameter } from 'reactive-primitives';
import { syncQueryParamsEffect } from 'reactive-primitives';

@Component({
  selector: 'app-details-page',
  imports: [RouterLink],
  template: `
    <div class="panel">
      <h2 class="mt-0">Details</h2>
      <p>
        Route param id: <strong>{{ id() }}</strong>
      </p>

      <div class="controls-row">
        <label for="q">Search query:</label>
        <input
          id="q"
          [value]="query()"
          (input)="onQueryInput($event)"
          placeholder="Type to update ?q=..."
        />
        <a class="btn secondary" routerLink="/details/7">Go to id 7</a>
      </div>

      <p class="mt-12 muted">
        Typing in the input will sync the value to the URL query parameter "q".
      </p>
    </div>
  `,
  styleUrls: ['./details-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
