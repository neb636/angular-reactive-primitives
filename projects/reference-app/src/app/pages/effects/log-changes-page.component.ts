import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'log-changes-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>logChangesEffect</ng-container>

      <ng-container documentation-description
        >Development helper effect that logs signal changes to the console. Useful for debugging and
        understanding signal behavior during development.</ng-container
      >

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'logChangesEffect Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogChangesPageComponent {
  parameters = [
    {
      name: 'config.signal',
      type: 'Signal<any>',
      description: 'The signal to monitor for changes',
    },
    {
      name: 'config.label',
      type: 'string',
      description: 'Optional label to identify the signal in logs (default: "Signal")',
    },
    {
      name: 'config.logLevel',
      type: "'log' | 'warn' | 'error' | 'info'",
      description: "Console method to use for logging (default: 'log')",
    },
  ];

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
};`;

  exampleCode = `import { Component, signal, computed } from '@angular/core';
import { logChangesEffect } from '@angular/reactive-primitives';

// Example 1: Basic signal logging
@Component({
  selector: 'search-component',
  template: \`
    <input 
      [value]="searchQuery()" 
      (input)="searchQuery.set($any($event.target).value)"
      placeholder="Search..."
    />
  \`
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
  template: \`<form><!-- form fields --></form>\`
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

// Example 3: Logging computed signals
@Component({
  selector: 'cart-component',
  template: \`
    <div>
      <p>Items: {{ itemCount() }}</p>
      <p>Total: \${{ totalPrice() }}</p>
    </div>
  \`
})
export class CartComponent {
  items = signal<Array<{ id: number; price: number; quantity: number }>>([]);

  itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor() {
    // Log when items array changes
    logChangesEffect({
      signal: this.items,
      label: 'Cart Items',
    });

    // Log when computed values change
    logChangesEffect({
      signal: this.itemCount,
      label: 'Item Count',
      logLevel: 'info',
    });

    logChangesEffect({
      signal: this.totalPrice,
      label: 'Total Price',
      logLevel: 'info',
    });
  }

  addItem(item: { id: number; price: number; quantity: number }) {
    this.items.update(items => [...items, item]);
  }
}

// Example 4: Conditional logging for debugging
@Component({
  selector: 'debug-component',
  template: \`<div>{{ data() }}</div>\`
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
}
