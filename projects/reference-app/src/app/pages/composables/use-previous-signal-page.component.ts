import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocPageComponent } from '../doc-page.component';

@Component({
  selector: 'app-use-previous-signal-page',
  imports: [DocPageComponent],
  template: `
    <app-doc-page
      title="usePreviousSignal"
      description="Creates a signal that holds the previous value of a source signal. Useful for tracking changes and implementing undo functionality."
      overview="The usePreviousSignal composable creates a signal that always contains the previous value of the source signal. This is particularly useful for implementing undo functionality, change detection, or any scenario where you need to compare current and previous values."
      [parameters]="parameters"
      returns="A readonly signal containing the previous value of the source signal"
      [sourceCode]="sourceCode"
      [exampleCode]="exampleCode"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsePreviousSignalPageComponent {
  parameters = [
    {
      name: 'sourceSignal',
      type: 'Signal<T>',
      description: 'The source signal to track the previous value of',
    },
  ];

  sourceCode = `import { Signal, effect, signal } from '@angular/core';

/*
 * Creates a signal that holds the previous value of a source signal.
 * Useful for tracking changes and implementing undo functionality.
 *
 * @param sourceSignal - The source signal to track the previous value of.
 *
 * Example:
 *
 * const currentValue = signal('initial');
 * const previousValue = usePreviousSignal(currentValue);
 */
export function usePreviousSignal<T>(sourceSignal: Signal<T>): Signal<T | undefined> {
  const previousSignal = signal<T | undefined>(undefined);

  effect(() => {
    const currentValue = sourceSignal();
    const previousValue = previousSignal();
    
    // Update the previous signal with the current value
    previousSignal.set(previousValue === undefined ? currentValue : previousValue);
  });

  return previousSignal.asReadonly();
}`;

  exampleCode = `import { Component, signal } from '@angular/core';
import { usePreviousSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'app-form',
  template: \`
    <input [(ngModel)]="formData" placeholder="Enter text..." />
    <button (click)="undo()" [disabled]="!canUndo()">Undo</button>
    <div>Current: {{ formData() }}</div>
    <div>Previous: {{ previousValue() }}</div>
  \`
})
export class FormComponent {
  formData = signal('');
  previousValue = usePreviousSignal(this.formData);

  canUndo() {
    return this.previousValue() !== undefined && 
           this.previousValue() !== this.formData();
  }

  undo() {
    if (this.canUndo()) {
      this.formData.set(this.previousValue()!);
    }
  }
}`;
}
