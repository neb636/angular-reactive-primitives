# useWindowSize

Creates signals that track the window size (width and height). The signals update when the window is resized, with debouncing to prevent excessive updates.

## Usage

```ts
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  template: `
    <h1>Window: {{ windowSize().width }}px × {{ windowSize().height }}px</h1>
    <p>Is mobile: {{ isMobile() }}</p>
  `,
})
class ResponsiveComponent {
  windowSize = useWindowSize();
  isMobile = computed(() => this.windowSize().width < 768);
}
```

## Parameters

| Parameter    | Type     | Default | Description                          |
| ------------ | -------- | ------- | ------------------------------------ |
| `debounceMs` | `number` | `100`   | Debounce delay for resize events (ms) |

## Returns

`Signal<{ width: number; height: number }>` - A readonly signal containing window dimensions

## Notes

- Returned signal is **readonly** to prevent direct manipulation
- Uses `createSharedComposable` internally so only one instance with shared event listeners exists
- Debounces resize events by default (100ms) to prevent excessive updates
- Event listeners are automatically cleaned up when no more subscribers
