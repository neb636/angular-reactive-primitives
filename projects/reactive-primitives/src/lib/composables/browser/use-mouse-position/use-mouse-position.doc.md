# useMousePosition

Creates signals that track the mouse position (x and y coordinates). The signals update when the mouse moves, with throttling to prevent excessive updates.

## Usage

```ts
import { Component } from '@angular/core';
import { useMousePosition } from 'angular-reactive-primitives';

@Component({
  selector: 'cursor-follower',
  template: `x: {{ mousePosition().x }}, y: {{ mousePosition().y }}`,
})
export class CursorFollowerComponent {
  mousePosition = useMousePosition();
}
```
