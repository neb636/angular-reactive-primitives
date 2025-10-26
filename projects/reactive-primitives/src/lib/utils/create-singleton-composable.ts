import {inject, Injector } from "@angular/core";

/**
 * Creates a singleton composable that only executes once per root injector.
 * Perfect for shared signals, event listeners, or any stateful logic that should
 * be shared across multiple component instances.
 *
 * @example
 * ```typescript
 * export const useOnlineStatus = createSingletonComposable(() => {
 *   const destroyRef = inject(DestroyRef);
 *   const isOnline = signal(navigator.onLine);
 *   const updateStatus = () => isOnline.set(navigator.onLine);
 *
 *   window.addEventListener('online', updateStatus);
 *   window.addEventListener('offline', updateStatus);
 *
 *   destroyRef.onDestroy(() => {
 *     window.removeEventListener('online', updateStatus);
 *     window.removeEventListener('offline', updateStatus);
 *   });
 *
 *   return isOnline.asReadonly();
 * });
 *
 * // Usage: Can be called 10,000 times, but logic runs once
 * const isOnline = useOnlineStatus();
 * ```
 */
export function createSingletonComposable<T>(
    factory: () => T
): () => T {
    // WeakMap ensures garbage collection when injector is destroyed
    const cache = new WeakMap<Injector, T>();

    return (): T => {
        // Get the root injector to ensure app-wide singleton
        const injector = inject(Injector);

        // Check if we've already created the value for this injector
        if (!cache.has(injector)) {
            // Execute the factory function once and cache the result
            cache.set(injector, factory());
        }

        return cache.get(injector)!;
    };
}