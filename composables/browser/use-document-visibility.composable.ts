import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/*
 * Creates a signal that tracks whether the document/tab is visible or hidden.
 * The signal updates when the user switches tabs or minimizes the window.
 *
 * Example:
 *
 * const isVisible = useDocumentVisibility();
 *
 * // Use in template
 * @if (isVisible()) {
 *   <div>Tab is visible</div>
 * } @else {
 *   <div>Tab is hidden</div>
 * }
 */
export function useDocumentVisibility(): Signal<boolean> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  
  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const visibilitySignal = signal<boolean>(!document.hidden);

  const handleVisibilityChange = () => {
    visibilitySignal.set(!document.hidden);
  };

  // Listen for visibility change events
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup listener on destroy
  destroyRef.onDestroy(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return visibilitySignal.asReadonly();
}
