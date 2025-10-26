import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../common/layout/documentation-section/documentation-section.component';
import { ParametersComponent } from '../../common/components/parameters/parameters.component';
import { CodeBlockComponent } from '../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-previous-signal-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    ParametersComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>usePreviousSignal</ng-container>
      <ng-container documentation-description
        >Creates a signal that holds the previous value of a source signal. Useful for tracking
        changes and implementing undo functionality.</ng-container
      >

      <documentation-section>
        <ng-container section-title>Overview</ng-container>
        <p>
          The usePreviousSignal composable creates a signal that always contains the previous value
          of the source signal. This is particularly useful for implementing undo functionality,
          change detection, or any scenario where you need to compare current and previous values.
        </p>
      </documentation-section>

      <parameters [parameters]="parameters"></parameters>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block [title]="'usePreviousSignal Source'" [code]="sourceCode" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Example Usage</ng-container>
        <code-block title="Example Usage" [code]="exampleCode" />
      </documentation-section>
    </documentation>
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
}
