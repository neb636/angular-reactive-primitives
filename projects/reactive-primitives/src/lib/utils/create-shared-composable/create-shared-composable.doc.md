# createSharedComposable

Creates a composable that shares a single instance per injector with reference counting. When the last consumer is destroyed, the shared instance and its resources are cleaned up automatically.

## Usage

```ts
import { createSharedComposable } from 'angular-reactive-primitives';

const useWebSocket = createSharedComposable(() => {
  const socket = new WebSocket('wss://api.example.com');
  const messages = signal<string[]>([]);

  socket.onmessage = (event) => {
    messages.update(m => [...m, event.data]);
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

## Parameters

| Parameter | Type                                                      | Default    | Description                               |
| --------- | --------------------------------------------------------- | ---------- | ----------------------------------------- |
| `factory` | `() => { value: T; cleanup?: () => void }`                | _required_ | Factory function that creates the shared resource |

## Returns

`() => T` - A composable function that returns the shared value

## Notes

- Uses reference counting: creates instance on first use, cleans up when last consumer is destroyed
- Perfect for sharing expensive resources like event listeners or WebSocket connections
- The `cleanup` function is optional but recommended for proper resource cleanup
- Uses `WeakMap` internally to ensure garbage collection
- Different from `createSingletonComposable` which never cleans up the instance
