import { Signal, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/*
 * Creates a signal that tracks the browser's online/offline status. The signal will update
 * when the network status changes.
 *
 * Example:
 *
 * const isOnline = useOnlineStatus();
 *
 * // Use in template
 * @if (isOnline()) {
 *   <div>You are online</div>
 * } @else {
 *   <div>You are offline</div>
 * }
 */
export function useOnlineStatus(): Signal<boolean> {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  
  if (!document.defaultView) {
    throw new Error('Window is not available');
  }

  const onlineSignal = signal<boolean>(document.defaultView.navigator.onLine);

  const handleOnline = () => onlineSignal.set(true);
  const handleOffline = () => onlineSignal.set(false);

  // Listen for online/offline events
  document.defaultView.addEventListener('online', handleOnline);
  document.defaultView.addEventListener('offline', handleOffline);

  // Cleanup listeners on destroy
  destroyRef.onDestroy(() => {
    document.defaultView?.removeEventListener('online', handleOnline);
    document.defaultView?.removeEventListener('offline', handleOffline);
  });

  return onlineSignal.asReadonly();
}
