export const sourceCode = `import { Signal, effect } from '@angular/core';

export type LogChangesEffectConfig = {
  signal: Signal<any>;
  label?: string;
  logLevel?: 'log' | 'warn' | 'error' | 'info';
};

/**
 * Development helper effect that logs signal changes to console.
 * Useful for debugging and understanding signal behavior during development.
 *
 * @param config - Configuration object
 * @param config.signal - Signal to log changes for
 * @param config.label - Optional label to identify the signal in logs
 * @param config.logLevel - Console method to use (default: 'log')
 *
 * Example:
 *
 * export class MyComponent {
 *   private searchQuery = signal('');
 *   private selectedItems = signal([]);
 *
 *   constructor() {
 *     // Log search query changes
 *     logChangesEffect({
 *       signal: this.searchQuery,
 *       label: 'Search Query'
 *     });
 *
 *     // Log selected items with warning level
 *     logChangesEffect({
 *       signal: this.selectedItems,
 *       label: 'Selected Items',
 *       logLevel: 'warn'
 *     });
 *   }
 * }
 */
export const logChangesEffect = (config: LogChangesEffectConfig) => {
  const { signal, label = 'Signal', logLevel = 'log' } = config;

  return effect(() => {
    const value = signal();
    const timestamp = new Date().toISOString();

    console[logLevel](\`[\${timestamp}] \${label}:\`, value);
  });
};`;

export const exampleCode =
  `import { Component, signal, computed } from '@angular/core';
import { logChangesEffect } from '@angular/reactive-primitives';

// Example 1: Basic signal logging
@Component({
  selector: 'search-component',
  template: ` +
  '`' +
  `
    <input 
      [value]="searchQuery()" 
      (input)="searchQuery.set($any($event.target).value)"
      placeholder="Search..."
    />
  ` +
  '`' +
  `
})
export class SearchComponent {
  searchQuery = signal('');

  constructor() {
    // Log every change to searchQuery
    logChangesEffect({
      signal: this.searchQuery,
      label: 'Search Query',
    });
  }
}

// Example 2: Multiple signals with different log levels
@Component({
  selector: 'form-component',
  template: ` +
  '`' +
  `<form><!-- form fields --></form>` +
  '`' +
  `
})
export class FormComponent {
  username = signal('');
  email = signal('');
  formErrors = signal<string[]>([]);
  isSubmitting = signal(false);

  constructor() {
    // Log user inputs with standard log level
    logChangesEffect({
      signal: this.username,
      label: 'Username',
      logLevel: 'log',
    });

    logChangesEffect({
      signal: this.email,
      label: 'Email',
      logLevel: 'log',
    });

    // Log errors with error level
    logChangesEffect({
      signal: this.formErrors,
      label: 'Form Errors',
      logLevel: 'error',
    });

    // Log submission state with info level
    logChangesEffect({
      signal: this.isSubmitting,
      label: 'Form Submitting',
      logLevel: 'info',
    });
  }
}


// Example 4: Conditional logging for debugging
@Component({
  selector: 'debug-component',
  template: ` +
  '`' +
  `<div>{{ data() }}</div>` +
  '`' +
  `
})
export class DebugComponent {
  data = signal<any>(null);
  isDebugMode = signal(false);

  constructor() {
    // Only log in debug mode (in production, you might use environment.production)
    if (this.isDebugMode()) {
      logChangesEffect({
        signal: this.data,
        label: 'Debug Data',
        logLevel: 'warn',
      });
    }
  }
}`;
