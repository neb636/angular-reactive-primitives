import { DestroyRef, inject, Injector } from '@angular/core';

type SharedComposableResult<T> = { value: T; cleanup?: () => void };

export const createSharedComposable = <T>(
  factory: () => SharedComposableResult<T>,
): (() => T) => {
  const cache = new WeakMap<
    Injector,
    { result: SharedComposableResult<T>; refCount: number }
  >();

  return (): T => {
    const injector = inject(Injector);
    const destroyRef = inject(DestroyRef);

    if (!cache.has(injector)) {
      cache.set(injector, {
        result: factory(),
        refCount: 0,
      });
    }

    const entry = cache.get(injector)!;
    entry.refCount++;

    // Cleanup when this component/service is destroyed
    destroyRef.onDestroy(() => {
      entry.refCount--;

      if (entry.refCount === 0) {
        // No more consumers, clean up the shared instance
        if (entry.result.cleanup) {
          entry.result.cleanup();
        }

        cache.delete(injector);
      }
    });

    return entry.result.value;
  };
};
