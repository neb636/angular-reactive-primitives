import { Component, computed, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'reactive-primitives';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  template: `
    <div class="panel" style="max-width: 720px;">
      <h2 style="margin: 0 0 12px 0">Settings</h2>

      <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
        <label class="card" style="display:flex; align-items:center; justify-content: space-between;">
          <span>Theme</span>
          <select [value]="theme()" (change)="onThemeChange($event)">
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label class="card" style="display:flex; align-items:center; justify-content: space-between;">
          <span>Compact mode</span>
          <input type="checkbox" [checked]="compact()" (change)="onCompactChange($event)" />
        </label>
      </div>

      <div class="card" style="margin-top: 12px;">
        <div class="badge">Preview</div>
        <pre style="white-space: pre-wrap; margin: 8px 0 0 0;">{{ settingsJson() }}</pre>
      </div>
    </div>
  `,
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
