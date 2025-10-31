# useMousePosition

Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.

## Usage

```ts
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  template: `<div>
    Mouse: {{ mousePosition().x }}, {{ mousePosition().y }}
  </div>`,
})
class CursorTrackerComponent {
  mousePosition = useMousePosition();
}
```

### With Custom Throttle

```ts
@Component({
  template: `<div>
    Mouse: {{ mousePosition().x }}, {{ mousePosition().y }}
  </div>`,
})
class SmoothCursorComponent {
  // Use a longer throttle for smoother updates
  mousePosition = useMousePosition(200);
}
```

## Parameters

| Parameter    | Type     | Default | Description                               |
| ------------ | -------- | ------- | ----------------------------------------- |
| `throttleMs` | `number` | `100`   | Throttle delay for mouse move events (ms) |

## Returns

`Signal<{ x: number; y: number }>` - A readonly signal containing mouse coordinates

## Notes

- Returned signal is **readonly** to prevent direct manipulation
- Uses `createSharedComposable` internally - components with the same `throttleMs` value share a single instance
- Different `throttleMs` values create separate instances with their own event listeners
- Throttles mouse move events by default (100ms) to prevent excessive updates
- Event listeners are automatically cleaned up when no more subscribers
