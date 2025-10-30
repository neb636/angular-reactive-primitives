# useMousePosition

Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.

## Usage

```ts
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  template: `<div>Mouse: {{ mousePosition().x }}, {{ mousePosition().y }}</div>`,
})
class CursorTrackerComponent {
  mousePosition = useMousePosition();
}
```

## Parameters

| Parameter    | Type     | Default | Description                           |
| ------------ | -------- | ------- | ------------------------------------- |
| `throttleMs` | `number` | `100`   | Throttle delay for mouse move events (ms) |

## Returns

`Signal<{ x: number; y: number }>` - A readonly signal containing mouse coordinates

## Notes

- Returned signal is **readonly** to prevent direct manipulation
- Uses `createSharedComposable` internally so only one instance with shared event listeners exists
- Throttles mouse move events by default (100ms) to prevent excessive updates
- Event listeners are automatically cleaned up when no more subscribers
