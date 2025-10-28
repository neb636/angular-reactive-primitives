import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { createSharedComposable } from '../../utils/create-shared-composable';

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
export const useDocumentVisibility = createSharedComposable(() => {
  const document = inject(DOCUMENT);

  const visibilitySignal = signal<boolean>(!document.hidden);
  const handleVisibilityChange = () => visibilitySignal.set(!document.hidden);

  // Listen for visibility change events
  document.defaultView?.addEventListener(
    'visibilitychange',
    handleVisibilityChange,
  );

  return {
    value: visibilitySignal.asReadonly(),
    cleanup: () => {
      document.defaultView?.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    },
  };
});
