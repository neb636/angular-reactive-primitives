# usePreviousSignal

Creates a signal that tracks the previous value of a source signal. Useful for comparing current vs previous state or implementing undo functionality.

## Usage

### Comparing Current and Previous Values

```ts
import { Component, signal, computed } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'value-comparator',
  template: `
    <div>
      <input type="number" [(ngModel)]="currentValue" />
      <div>Current: {{ currentValue() }}</div>
      <div>Previous: {{ previousValue() ?? 'N/A' }}</div>
      <div>Change: {{ changeDirection() }}</div>
    </div>
  `,
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
}
```

### Undo Functionality

```ts
import { Component, signal } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

@Component({
  selector: 'undoable-editor',
  template: `
    <div>
      <textarea [(ngModel)]="content"></textarea>
      <button (click)="undo()" [disabled]="!canUndo()">Undo</button>
    </div>
  `,
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
}
```

### Tracking State Transitions

```ts
import { Component, signal, effect } from '@angular/core';
import { usePreviousSignal } from 'angular-reactive-primitives';

type AppState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'state-tracker',
  template: `
    <div>
      <div>Current State: {{ state() }}</div>
      <div>Previous State: {{ previousState() ?? 'None' }}</div>
      @if (transitionMessage()) {
        <div class="transition">{{ transitionMessage() }}</div>
      }
    </div>
  `,
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
          `Transitioned from ${previous} to ${current}`,
        );
      }
    });
  }
}
```
