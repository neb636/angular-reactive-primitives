import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';
@Component({
  selector: 'log-changes-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>logChangesEffect</ng-container>
      <p>Development helper effect that logs signal changes to console. Useful for debugging and understanding signal behavior during development.</p>

      <documentation-section>
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogChangesPageComponent {
  sourceCode = `import { Signal, effect } from '@angular/core';

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
};
`;
}
