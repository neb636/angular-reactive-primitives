import { DocMetadata, DocEntry } from '../../types/doc-metadata.type';
import sourceCodeRaw from './log-changes.effect.ts?raw';

export const metadata: DocMetadata = {
  name: 'logChangesEffect',
  title: 'logChangesEffect',
  description:
    'Development helper effect that logs signal changes to console. Useful for debugging and understanding signal behavior during development.',
  category: 'effects',
  parameters: [
    {
      name: 'config',
      type: 'LogChangesEffectConfig',
      description: 'Configuration object for the effect',
    },
    {
      name: 'config.signal',
      type: 'Signal<any>',
      description: 'Signal to log changes for',
    },
    {
      name: 'config.label',
      type: 'string',
      description: 'Optional label to identify the signal in logs',
      optional: true,
      defaultValue: "'Signal'",
    },
    {
      name: 'config.logLevel',
      type: "'log' | 'warn' | 'error' | 'info'",
      description: 'Console method to use for logging',
      optional: true,
      defaultValue: "'log'",
    },
  ],
  returnType: 'EffectRef',
  returnDescription: 'An effect reference that can be used to stop the effect',
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = `import { Component, signal } from '@angular/core';
import { logChangesEffect } from 'reactive-primitives';

@Component({
  selector: 'user-form',
  template: \`
    <form>
      <input 
        type="text" 
        [(ngModel)]="username" 
        placeholder="Username"
      />
      
      <input 
        type="email" 
        [(ngModel)]="email" 
        placeholder="Email"
      />
      
      <div>
        <label>
          <input type="checkbox" [(ngModel)]="agreeToTerms" />
          I agree to terms
        </label>
      </div>
    </form>
  \`
})
export class UserFormComponent {
  username = signal('');
  email = signal('');
  agreeToTerms = signal(false);

  constructor() {
    // Log username changes for debugging
    logChangesEffect({
      signal: this.username,
      label: 'Username'
    });

    // Log email changes with info level
    logChangesEffect({
      signal: this.email,
      label: 'Email',
      logLevel: 'info'
    });

    // Log terms agreement with warning level
    logChangesEffect({
      signal: this.agreeToTerms,
      label: 'Terms Agreement',
      logLevel: 'warn'
    });
  }
}`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
