import { Signal, signal, effect, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/*
 * Creates a signal that tracks whether a media query matches. The signal will update
 * when the media query match state changes (e.g., window resize, orientation change).
 *
 * @param query - The media query string to match against
 *
 * Example:
 *
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 *
 * // Use in template
 * @if (isDarkMode()) {
 *   <div>Dark mode is active</div>
 * }
 */
export function useMediaQuery(query: string): Signal<boolean> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  
  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const mediaQuery = document.defaultView.matchMedia(query);
  const matchesSignal = signal<boolean>(mediaQuery.matches);

  // Listen for changes to the media query
  const handleChange = (event: MediaQueryListEvent) => {
    matchesSignal.set(event.matches);
  };

  mediaQuery.addEventListener('change', handleChange);

  // Cleanup listener on destroy
  destroyRef.onDestroy(() => {
    mediaQuery.removeEventListener('change', handleChange);
  });

  return matchesSignal.asReadonly();
}
