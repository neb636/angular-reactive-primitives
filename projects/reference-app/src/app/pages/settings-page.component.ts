import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'reactive-primitives';

@Component({
  selector: 'app-settings-page',
  template: `
    <div class="panel max-720">
      <h2 class="title">Settings</h2>

      <div class="grid-two">
        <label class="card row-space">
          <span>Theme</span>
          <select [value]="theme()" (change)="onThemeChange($event)">
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label class="card row-space">
          <span>Compact mode</span>
          <input type="checkbox" [checked]="compact()" (change)="onCompactChange($event)" />
        </label>
      </div>

      <div class="card mt-12">
        <div class="badge">Preview</div>
        <pre class="pre">{{ settingsJson() }}</pre>
      </div>
    </div>
  `,
  styleUrls: ['./settings-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  readonly theme = signal<'system' | 'dark' | 'light'>('system');
  readonly compact = signal<boolean>(false);

  readonly settings = computed(() => ({ theme: this.theme(), compact: this.compact() }));
  readonly settingsJson = computed(() => JSON.stringify(this.settings(), null, 2));

  // Persist settings to localStorage as the user changes them
  readonly _persist = syncLocalStorageEffect({
    signal: this.settings,
    key: 'reference-app:settings',
  });

  onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.theme.set(target.value as 'system' | 'dark' | 'light');
  }

  onCompactChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.compact.set(target.checked);
  }
}
