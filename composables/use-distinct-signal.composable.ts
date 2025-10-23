import { Signal, computed, signal } from '@angular/core';

/*
 * Creates a signal that only emits when the value actually changes. Uses deep equality
 * comparison by default, but you can provide a custom comparator function.
 *
 * @param sourceSignal - The source signal to make distinct.
 * @param comparator - Optional custom comparator function for comparing values.
 *
 * Example:
 *
 * const userInput = signal({ name: 'John', age: 30 });
 *
 * // Only emit when the object actually changes
 * const distinctUserInput = useDistinctSignal(userInput);
 *
 * // With custom comparator
 * const distinctByAge = useDistinctSignal(userInput, (a, b) => a.age === b.age);
 */
export function useDistinctSignal<T>(
  sourceSignal: Signal<T>,
  comparator?: (a: T, b: T) => boolean
): Signal<T> {
  const distinctSignal = signal<T>(sourceSignal());
  let lastValue = sourceSignal();

  const isEqual = comparator || ((a: T, b: T) => JSON.stringify(a) === JSON.stringify(b));

  return computed(() => {
    const currentValue = sourceSignal();
    
    if (!isEqual(currentValue, lastValue)) {
      lastValue = currentValue;
      distinctSignal.set(currentValue);
    }
    
    return distinctSignal();
  });
}
