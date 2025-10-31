# useElementBounding

Creates signals that track an element's bounding box (position and dimensions). The signals update when the element is resized, and optionally when the window scrolls.

Uses ResizeObserver for efficient element size tracking and optional scroll listening for position updates.

## Usage

```ts
import { useElementBounding } from 'angular-reactive-primitives';

@Component({
  template: `
    <div #myElement>Track this element</div>
    <div>
      <p>Position: {{ bounding().x }}px, {{ bounding().y }}px</p>
      <p>Size: {{ bounding().width }}px × {{ bounding().height }}px</p>
      <p>Top: {{ bounding().top }}px</p>
      <p>Is visible: {{ isInViewport() }}</p>
    </div>
  `,
})
class BoundingTrackerComponent {
  elementRef = viewChild<ElementRef>('myElement');
  element = computed(() => this.elementRef()?.nativeElement);
  
  bounding = useElementBounding(this.element);
  
  isInViewport = computed(() => {
    const box = this.bounding();
    return box.top >= 0 && 
           box.left >= 0 && 
           box.bottom <= window.innerHeight && 
           box.right <= window.innerWidth;
  });
}
```

## Advanced Usage: Tracking Scroll Position

```ts
@Component({
  template: `
    <div #sticky class="sticky-header">Sticky Header</div>
    <p>Is stuck: {{ isStuck() }}</p>
  `,
})
class StickyHeaderComponent {
  stickyRef = viewChild<ElementRef>('sticky');
  stickyElement = computed(() => this.stickyRef()?.nativeElement);
  
  // Enable scroll updates to track position changes
  bounding = useElementBounding(this.stickyElement, { 
    updateOnScroll: true,
    debounceMs: 50 
  });
  
  isStuck = computed(() => this.bounding().top <= 0);
}
```

## Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `elementSignal` | `Signal<HTMLElement \| Element \| null \| undefined>` | Yes | A signal containing the element to track |
| `options` | `UseElementBoundingOptions` | No | Configuration options (see below) |

### UseElementBoundingOptions

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `updateOnScroll` | `boolean` | `false` | Whether to update the bounding box when the window is scrolled. Useful for tracking position changes of fixed/sticky elements. |
| `debounceMs` | `number` | `100` | Debounce delay for updates in milliseconds. Prevents excessive updates during rapid changes. |
| `resetOnElementChange` | `boolean` | `true` | Whether to reset bounding box to zero when element becomes null/undefined |

## Returns

`Signal<ElementBoundingBox>` - A readonly signal containing the element's bounding box

### ElementBoundingBox Properties

| Property | Type | Description |
| -------- | ---- | ----------- |
| `x` | `number` | The x coordinate of the element's left edge relative to viewport |
| `y` | `number` | The y coordinate of the element's top edge relative to viewport |
| `top` | `number` | Distance from the top of the viewport to the top edge of the element |
| `right` | `number` | Distance from the left of the viewport to the right edge of the element |
| `bottom` | `number` | Distance from the top of the viewport to the bottom edge of the element |
| `left` | `number` | Distance from the left of the viewport to the left edge of the element |
| `width` | `number` | The width of the element in pixels |
| `height` | `number` | The height of the element in pixels |

## Use Cases

### 1. Responsive Layouts

```ts
const containerBounding = useElementBounding(containerElement);
const shouldStack = computed(() => containerBounding().width < 600);
```

### 2. Intersection Detection

```ts
const element1Bounding = useElementBounding(element1);
const element2Bounding = useElementBounding(element2);

const isIntersecting = computed(() => {
  const box1 = element1Bounding();
  const box2 = element2Bounding();
  
  return !(
    box1.right < box2.left ||
    box1.left > box2.right ||
    box1.bottom < box2.top ||
    box1.top > box2.bottom
  );
});
```

### 3. Lazy Loading Trigger

```ts
const imageBounding = useElementBounding(imageElement, { updateOnScroll: true });
const shouldLoad = computed(() => {
  const box = imageBounding();
  const threshold = 200; // pixels
  return box.top < window.innerHeight + threshold;
});
```

### 4. Tooltip Positioning

```ts
const buttonBounding = useElementBounding(buttonElement);

const tooltipStyle = computed(() => ({
  position: 'fixed',
  left: `${buttonBounding().left + buttonBounding().width / 2}px`,
  top: `${buttonBounding().top - 10}px`,
  transform: 'translate(-50%, -100%)',
}));
```

## Notes

- **Efficient Tracking**: Uses ResizeObserver API for efficient element size monitoring
- **Scroll Updates**: Set `updateOnScroll: true` to track position changes during scroll (useful for sticky/fixed elements)
- **Automatic Cleanup**: Observer and event listeners are automatically cleaned up when the component is destroyed
- **Null Safety**: Handles null/undefined elements gracefully by resetting to zero values
- **Debounced Updates**: Debounces updates by default (100ms) to prevent excessive change detection cycles
- **Viewport Relative**: All position values (x, y, top, right, bottom, left) are relative to the viewport
- **Initial Values**: Returns zero for all properties until the element is available and measured

## Performance Tips

- Use a higher `debounceMs` value (e.g., 200-500ms) for heavy UI updates
- Only enable `updateOnScroll` when necessary, as it adds scroll event listeners
- Consider using `computed()` to derive specific values you need rather than watching the entire bounding box
- For intersection detection, consider using the native IntersectionObserver API directly for better performance
