# useThrottledSignal

Creates a throttled signal from a source signal. Unlike debounce, throttle emits the first value immediately and then waits for the throttle period before emitting subsequent values.

## Usage

```ts
import { useThrottledSignal } from 'angular-reactive-primitives';

@Component({
  template: `
    <div (mousemove)="updatePosition($event)">
      Mouse updates: {{ mouseX() }}
      <p>Throttled updates: {{ throttledX() }}</p>
    </div>
  `,
})
class ExampleComponent {
  mouseX = signal(0);
  throttledX = useThrottledSignal(this.mouseX, 500);

  updatePosition(event: MouseEvent) {
    this.mouseX.set(event.clientX);
  }
}
```

## Parameters

| Parameter      | Type        | Default    | Description                        |
| -------------- | ----------- | ---------- | ---------------------------------- |
| `sourceSignal` | `Signal<T>` | _required_ | The source signal to throttle      |
| `delayMs`      | `number`    | `300`      | The throttle delay in milliseconds |

## Returns

`Signal<T>` - A readonly signal that emits at regular intervals during activity

## Debounce vs Throttle

| **Debounce**                 | **Throttle**                         |
| ---------------------------- | ------------------------------------ |
| Waits for "quiet period"     | Executes at regular intervals        |
| Good for: search, validation | Good for: scroll, resize, mouse move |
| Last value after inactivity  | Periodic values during activity      |

## Notes

- The throttled signal is **readonly** to prevent direct manipulation
- Emits the first value immediately, then throttles subsequent updates
- Uses lodash's `throttle` implementation for reliable behavior
- Consider using `useDebouncedSignal` for events like search input where you want to wait for user to stop typing
