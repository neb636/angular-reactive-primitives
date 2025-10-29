# useWindowSize

Creates signals that track the window size (width and height). The signals update when the window is resized, with debouncing to prevent excessive updates.

## Usage

```ts
import { Component, computed } from '@angular/core';
import { useWindowSize } from 'angular-reactive-primitives';

@Component({
  selector: 'size-aware',
  template: `
    <h1>Window size:</h1>
    <span>width: {{ windowSize().width }}px</span>
    <span>height: {{ windowSize().height }}px</span>
  `,
})
export class SizeAwareComponent {
  windowSize = useWindowSize();
}
```
