import { DestroyRef, inject, Injector } from '@angular/core';

type SharedComposableResult<T> = { value: T; cleanup?: () => void };

type CacheEntry<T> = {
  result: SharedComposableResult<T>;
  refCount: number;
};

/**
 * Creates a shared composable that caches its result per injector context and parameters.
 * The factory function can accept parameters, and different parameter values will create
 * separate cached instances within the same injector context.
 *
 * @param factory - A factory function that creates the composable result
 * @returns A composable function that shares its result across all consumers with the same parameters
 *
 * @example
 * // Factory with no parameters
 * export const useSharedData = createSharedComposable(() => {
 *   const data = signal(fetchData());
 *   return { value: data };
 * });
 *
 * @example
 * // Factory with parameters - different params create different instances
 * export const useWindowSize = createSharedComposable((debounceMs = 100) => {
 *   const size = signal(getWindowSize());
 *   // debounce logic...
 *   return { value: size };
 * });
 *
 * // Component A uses 100ms - creates first instance
 * windowSize = useWindowSize(100);
 *
 * // Component B uses 100ms - shares instance with A
 * windowSize = useWindowSize(100);
 *
 * // Component C uses 500ms - creates second instance
 * windowSize = useWindowSize(500);
 *
 * @remarks
 * Parameters must be JSON-serializable (primitives, arrays, plain objects).
 * Functions, symbols, and circular references are not supported.
 */
export const createSharedComposable = <TArgs extends unknown[], TResult>(
  factory: (...args: TArgs) => SharedComposableResult<TResult>,
): ((...args: TArgs) => TResult) => {
  // Cache structure: Injector -> Map<paramsKey, CacheEntry>
  const cache = new WeakMap<Injector, Map<string, CacheEntry<TResult>>>();

  return (...args: TArgs): TResult => {
    const injector = inject(Injector);
    const destroyRef = inject(DestroyRef);

    // Create a cache key from the parameters
    const paramsKey = args.length > 0 ? JSON.stringify(args) : '__no_params__';

    // Get or create the params map for this injector
    if (!cache.has(injector)) {
      cache.set(injector, new Map());
    }

    const paramsMap = cache.get(injector)!;

    // Get or create the cache entry for these specific parameters
    if (!paramsMap.has(paramsKey)) {
      paramsMap.set(paramsKey, {
        result: factory(...args),
        refCount: 0,
      });
    }

    const entry = paramsMap.get(paramsKey)!;
    entry.refCount++;

    // Cleanup when this component/service is destroyed
    destroyRef.onDestroy(() => {
      entry.refCount--;

      if (entry.refCount === 0) {
        // No more consumers, clean up the shared instance
        if (entry.result.cleanup) {
          entry.result.cleanup();
        }

        paramsMap.delete(paramsKey);

        // Clean up the injector's map if empty
        if (paramsMap.size === 0) {
          cache.delete(injector);
        }
      }
    });

    return entry.result.value;
  };
};
