import { DocMetadata, DocEntry } from '../../types/doc-metadata.type';
import sourceCodeRaw from './sync-local-storage.effect.ts?raw';

export const metadata: DocMetadata = {
  name: 'syncLocalStorageEffect',
  title: 'syncLocalStorageEffect',
  description:
    "Effect that syncs a signal to localStorage (one-way: signal → storage). This is useful when you want to persist signal changes but don't need two-way sync.",
  category: 'effects',
  parameters: [
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
      description: 'Optional custom serialization function',
      optional: true,
      defaultValue: 'JSON.stringify',
    },
  ],
  returnType: 'EffectRef',
  returnDescription: 'An effect reference that can be used to stop the effect',
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = `import { Component, signal } from '@angular/core';
import { syncLocalStorageEffect } from 'reactive-primitives';

@Component({
  selector: 'settings',
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
      key: 'theme'
    });

    // Sync language to localStorage
    syncLocalStorageEffect({
      signal: this.language,
      key: 'language'
    });
  }
}`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
