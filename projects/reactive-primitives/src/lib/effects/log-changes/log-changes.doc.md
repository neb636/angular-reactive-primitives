# logChangesEffect

Development helper effect that logs signal changes to console. Useful for debugging and understanding signal behavior during development.

## Usage

### Basic Logging

```ts
import { Component, signal } from '@angular/core';
import { logChangesEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'debug-component',
  template: `
    <input [(ngModel)]="searchQuery" placeholder="Search..." />
    <p>Query: {{ searchQuery() }}</p>
  `,
})
export class DebugComponent {
  searchQuery = signal('');

  constructor() {
    // Log all changes to searchQuery
    logChangesEffect({
      signal: this.searchQuery,
      label: 'Search Query',
    });
  }
}

// Console output:
// [2025-10-28T12:34:56.789Z] Search Query: angular
// [2025-10-28T12:34:58.123Z] Search Query: angular reactive
```

### Multiple Log Levels

```ts
import { Component, signal } from '@angular/core';
import { logChangesEffect } from 'angular-reactive-primitives';

@Component({
  selector: 'monitoring-component',
  template: `
    <div>
      <button (click)="incrementCounter()">Count: {{ counter() }}</button>
      <button (click)="toggleError()">Toggle Error</button>
    </div>
  `,
})
export class MonitoringComponent {
  counter = signal(0);
  errorState = signal(false);
  selectedItems = signal<string[]>([]);

  constructor() {
    // Regular logging
    logChangesEffect({
      signal: this.counter,
      label: 'Counter',
      logLevel: 'log',
    });

    // Warning level for important state
    logChangesEffect({
      signal: this.selectedItems,
      label: 'Selected Items',
      logLevel: 'warn',
    });

    // Error level for error states
    logChangesEffect({
      signal: this.errorState,
      label: 'Error State',
      logLevel: 'error',
    });
  }

  incrementCounter() {
    this.counter.update((c) => c + 1);
  }

  toggleError() {
    this.errorState.update((e) => !e);
  }
}
```

### Debugging Complex State

```ts
import { Component, signal, computed } from '@angular/core';
import { logChangesEffect } from 'angular-reactive-primitives';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

@Component({
  selector: 'preferences-debug',
  template: `
    <div>
      <select [(ngModel)]="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  `,
})
export class PreferencesDebugComponent {
  theme = signal<'light' | 'dark'>('light');
  language = signal('en');
  notifications = signal(true);

  preferences = computed<UserPreferences>(() => ({
    theme: this.theme(),
    language: this.language(),
    notifications: this.notifications(),
  }));

  constructor() {
    // Log the entire preferences object
    logChangesEffect({
      signal: this.preferences,
      label: 'User Preferences',
      logLevel: 'info',
    });

    // Log individual properties
    logChangesEffect({
      signal: this.theme,
      label: 'Theme',
    });
  }
}

// Console output:
// [2025-10-28T12:34:56.789Z] User Preferences: {theme: 'dark', language: 'en', notifications: true}
// [2025-10-28T12:34:56.789Z] Theme: dark
```

### Conditional Logging

```ts
import { Component, signal, effect } from '@angular/core';
import { logChangesEffect } from 'angular-reactive-primitives';
import { environment } from '../environments/environment';

@Component({
  selector: 'production-safe',
  template: `<div>Counter: {{ counter() }}</div>`,
})
export class ProductionSafeComponent {
  counter = signal(0);

  constructor() {
    // Only log in development
    if (!environment.production) {
      logChangesEffect({
        signal: this.counter,
        label: 'Counter (Dev Only)',
      });
    }
  }
}
```
