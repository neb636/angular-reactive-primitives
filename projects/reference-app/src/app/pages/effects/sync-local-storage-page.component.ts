import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageComponent } from '../doc-page.component';

@Component({
  selector: 'app-sync-local-storage-page',
  imports: [DocPageComponent],
  template: `
    <app-doc-page
      title="syncLocalStorage"
      description="Effect that syncs a signal to localStorage (one-way: signal → storage). This is useful when you want to persist signal changes but don't need two-way sync."
      overview="The syncLocalStorage effect automatically saves signal values to localStorage whenever they change. This provides a simple way to persist application state without the complexity of two-way synchronization."
      [parameters]="parameters"
      returns="void"
      [sourceCode]="sourceCode"
      [exampleCode]="exampleCode"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncLocalStoragePageComponent {
  parameters = [
    {
      name: 'config',
      type: 'SyncLocalStorageEffectConfig',
      description: 'Configuration object for the effect',
    },
    {
      name: 'config.signal',
      type: 'Signal<any>',
      description: 'Signal to sync to localStorage',
    },
    {
      name: 'config.key',
      type: 'string',
      description: 'localStorage key to sync to',
    },
    {
      name: 'config.serialize',
      type: '(value: any) => string',
      description: 'Optional custom serialization function (defaults to JSON.stringify)',
    },
  ];

  sourceCode = `import { Signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type SyncLocalStorageEffectConfig = {
  signal: Signal<any>;
  key: string;
  serialize?: (value: any) => string;
};

/**
 * Effect that syncs a signal to localStorage (one-way: signal → storage).
 * This is useful when you want to persist signal changes but don't need
 * two-way sync (use useLocalStorage composable for that).
 *
 * @param config - Configuration object
 * @param config.signal - Signal to sync to localStorage
 * @param config.key - localStorage key to sync to
 * @param config.serialize - Optional custom serialization function
 *
 * Example:
 *
 * export class MyComponent {
 *   private formData = signal({ name: '', email: '' });
 *
 *   constructor() {
 *     // Sync form data to localStorage whenever it changes
 *     syncLocalStorageEffect({
 *       signal: this.formData,
 *       key: 'form-data'
 *     });
 *   }
 * }
 */
export const syncLocalStorageEffect = (config: SyncLocalStorageEffectConfig) => {
  const document = inject(DOCUMENT);
  const storage = document.defaultView?.localStorage;
  
  if (!storage) {
    console.warn('localStorage is not available');
    return;
  }

  const { signal, key, serialize = JSON.stringify } = config;

  return effect(() => {
    const value = signal();
    try {
      storage.setItem(key, serialize(value));
    } catch (error) {
      console.warn(\`Failed to save to localStorage for key "\${key}":\`, error);
    }
  });
};`;

  exampleCode = `import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from '@angular/reactive-primitives';

@Component({
  selector: 'app-settings',
  template: \`
    <div>
      <label>
        Theme:
        <select [(ngModel)]="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      
      <label>
        Language:
        <select [(ngModel)]="language">
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>
      </label>
    </div>
  \`
})
export class SettingsComponent {
  theme = signal('light');
  language = signal('en');

  constructor() {
    // Sync theme to localStorage
    syncLocalStorageEffect({
      signal: this.theme,
      key: 'app-theme'
    });

    // Sync language to localStorage
    syncLocalStorageEffect({
      signal: this.language,
      key: 'app-language'
    });
  }
}`;
}
