import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-previous-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>usePreviousSignal</ng-container>

      <ng-container documentation-description>
        Creates a signal that tracks the previous value of a source signal. Useful for comparing current vs previous state or implementing undo functionality.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />

        <code-block [code]="code_usage_1" />

        <code-block [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="usePreviousSignal Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsePreviousSignalPageComponent {
  code_usage_0 = `import { Component, signal, computed } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'value-comparator',
  template: \`
    <div>
      <input type="number" [(ngModel)]="currentValue" />
      <div>Current: {{ currentValue() }}</div>
      <div>Previous: {{ previousValue() ?? 'N/A' }}</div>
      <div>Change: {{ changeDirection() }}</div>
    </div>
  \`,
})
export class ValueComparatorComponent {
  currentValue = signal(0);
  previousValue = usePreviousSignal(this.currentValue);

  changeDirection = computed(() => {
    const current = this.currentValue();
    const previous = this.previousValue();

    if (previous === undefined) return 'Initial value';
    if (current > previous) return '📈 Increased';
    if (current < previous) return '📉 Decreased';
    return '➡️ No change';
  });
}`;

  code_usage_1 = `import { Component, signal } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'undoable-editor',
  template: \`
    <div>
      <textarea [(ngModel)]="content"></textarea>
      <button (click)="undo()" [disabled]="!canUndo()">Undo</button>
    </div>
  \`,
})
export class UndoableEditorComponent {
  content = signal('');
  previousContent = usePreviousSignal(this.content);

  canUndo = () => this.previousContent() !== undefined;

  undo() {
    const previous = this.previousContent();
    if (previous !== undefined) {
      this.content.set(previous);
    }
  }
}`;

  code_usage_2 = `import { Component, signal, effect } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

type AppState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'state-tracker',
  template: \`
    <div>
      <div>Current State: {{ state() }}</div>
      <div>Previous State: {{ previousState() ?? 'None' }}</div>
      @if (transitionMessage()) {
        <div class="transition">{{ transitionMessage() }}</div>
      }
    </div>
  \`,
})
export class StateTrackerComponent {
  state = signal<AppState>('idle');
  previousState = usePreviousSignal(this.state);
  transitionMessage = signal<string>('');

  constructor() {
    effect(() => {
      const current = this.state();
      const previous = this.previousState();

      if (previous && current !== previous) {
        this.transitionMessage.set(
          \`Transitioned from \${previous} to \${current}\`,
        );
      }
    });
  }
}`;

  sourceCode = `import { Signal, computed, signal } from '@angular/core';

/*
 * Creates a signal that tracks the previous value of a source signal. Useful for comparing
 * current vs previous state or implementing undo functionality.
 *
 * @param sourceSignal - The source signal to track the previous value of.
 *
 * Example:
 *
 * const currentValue = signal('hello');
 * const previousValue = usePreviousSignal(currentValue);
 *
 * // previousValue() will be undefined initially, then track the previous value
 * console.log(previousValue()); // undefined
 * currentValue.set('world');
 * console.log(previousValue()); // 'hello'
 */
export function usePreviousSignal<T>(sourceSignal: Signal<T>): Signal<T | undefined> {
  const previousSignal = signal<T | undefined>(undefined);
  let lastValue = sourceSignal();

  return computed(() => {
    const currentValue = sourceSignal();

    if (currentValue !== lastValue) {
      previousSignal.set(lastValue);
      lastValue = currentValue;
    }

    return previousSignal();
  });
}
`;
}
