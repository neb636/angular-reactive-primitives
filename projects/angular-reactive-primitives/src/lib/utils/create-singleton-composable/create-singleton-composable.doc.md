# createSingletonComposable

Creates a singleton composable that executes only once per root injector. Perfect for shared signals, event listeners, or any stateful logic that should be shared globally across the entire application.

## Usage

```ts
import { createSingletonComposable } from 'angular-reactive-primitives';

const useOnlineStatus = createSingletonComposable(() => {
  const destroyRef = inject(DestroyRef);
  const isOnline = signal(navigator.onLine);

  const updateStatus = () => isOnline.set(navigator.onLine);

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  destroyRef.onDestroy(() => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  });

  return isOnline.asReadonly();
});

// Can be called 10,000 times, but logic runs only once
@Component({})
class HeaderComponent {
  isOnline = useOnlineStatus();
}

@Component({})
class FooterComponent {
  isOnline = useOnlineStatus(); // Same instance as HeaderComponent
}
```

## Parameters

| Parameter | Type      | Default    | Description                                   |
| --------- | --------- | ---------- | --------------------------------------------- |
| `factory` | `() => T` | _required_ | Factory function that creates the singleton   |

## Returns

`() => T` - A composable function that returns the singleton value

## Notes

- Executes the factory function only once per root injector
- Uses `WeakMap` internally to cache results and enable garbage collection
- Perfect for app-wide shared state or global event listeners
- Different from `createSharedComposable` which uses reference counting and cleans up resources
- The singleton lives for the lifetime of the injector (typically the entire app)
