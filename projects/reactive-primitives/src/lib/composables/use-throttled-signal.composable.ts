import { Signal, effect, signal } from '@angular/core';
import throttle from 'lodash-es/throttle';

/*
 * Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value
 * immediately and then waits for the throttle period before emitting subsequent values.
 *
 * @param sourceSignal - The source signal to throttle.
 * @param delayMs - The throttle delay in milliseconds (default: 300).
 *
 * Example:
 *
 * const searchInputText = signal('');
 *
 * // Create a throttled signal for searchInputText
 * const throttledSearchInputText = useThrottledSignal(searchInputText, 500);
 */
export function useThrottledSignal<T>(sourceSignal: Signal<T>, delayMs: number = 300): Signal<T> {
  const throttledSignal = signal<T>(sourceSignal());

  const throttledUpdate = throttle((value: T) => {
    throttledSignal.set(value);
  }, delayMs);

  effect(() => {
    const value = sourceSignal();
    throttledUpdate(value);
  });

  return throttledSignal.asReadonly();
}
