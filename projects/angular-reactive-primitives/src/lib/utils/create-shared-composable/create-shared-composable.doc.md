# createSharedComposable

Creates a composable that shares a single instance per injector with reference counting. When the last consumer is destroyed, the shared instance and its resources are cleaned up automatically.

## Usage

### Basic Usage (No Parameters)

```ts
import { createSharedComposable } from 'angular-reactive-primitives';

const useWebSocket = createSharedComposable(() => {
  const socket = new WebSocket('wss://api.example.com');
  const messages = signal<string[]>([]);

  socket.onmessage = (event) => {
    messages.update((m) => [...m, event.data]);
  };

  return {
    value: messages.asReadonly(),
    cleanup: () => socket.close(),
  };
});

// Multiple components can use this - only one WebSocket connection is created
@Component({})
class ComponentA {
  messages = useWebSocket(); // Creates the WebSocket
}

@Component({})
class ComponentB {
  messages = useWebSocket(); // Reuses the same WebSocket
}
```

### With Parameters

The factory function can accept parameters. Different parameter values create separate cached instances, while the same parameter values share a single instance.

```ts
const useWindowSize = createSharedComposable((debounceMs = 100) => {
  const document = inject(DOCUMENT);
  const size = signal(getCurrentSize());

  const handleResize = () => size.set(getCurrentSize());
  document.defaultView?.addEventListener('resize', handleResize);

  return {
    value: useDebouncedSignal(size, debounceMs),
    cleanup: () => {
      document.defaultView?.removeEventListener('resize', handleResize);
    },
  };
});

@Component({})
class ComponentA {
  // Creates first instance with 200ms debounce
  windowSize = useWindowSize(200);
}

@Component({})
class ComponentB {
  // Shares the same instance as ComponentA (both use 200ms)
  windowSize = useWindowSize(200);
}

@Component({})
class ComponentC {
  // Creates a separate instance with 500ms debounce
  windowSize = useWindowSize(500);
}
```

## Parameters

| Parameter | Type                                              | Default    | Description                                                                   |
| --------- | ------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `factory` | `(...args) => { value: T; cleanup?: () => void }` | _required_ | Factory function that creates the shared resource. Can accept any parameters. |

## Returns

`(...args) => T` - A composable function that accepts the same parameters as the factory and returns the shared value

## Notes

- Uses reference counting: creates instance on first use, cleans up when last consumer is destroyed
- Perfect for sharing expensive resources like event listeners or WebSocket connections
- The `cleanup` function is optional but recommended for proper resource cleanup
- Uses `WeakMap` internally to ensure garbage collection
- Different from `createSingletonComposable` which never cleans up the instance
- **When using parameters**:
  - Different parameter values create separate cached instances
  - Same parameter values share a single instance
  - Parameters must be JSON-serializable (primitives, arrays, plain objects)
  - Functions, symbols, and circular references are not supported as parameters
