export const sourceCode = `import { Signal, effect, signal } from '@angular/core';

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

export const exampleCode = `import { Component, signal } from '@angular/core';
import { usePreviousSignal } from '@angular/reactive-primitives';

@Component({
  selector: 'form',
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
