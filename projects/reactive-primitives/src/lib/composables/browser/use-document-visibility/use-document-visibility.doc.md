# useDocumentVisibility

Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.

## Usage

```ts
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
  template: `<h1>Tab currently visible: {{ isVisible() }}</h1>`,
})
class ExampleComponent {
  isVisible = useDocumentVisibility();
}
```

## Returns

`Signal<boolean>`

## Notes

- Returned signal is **readonly** to prevent direct manipulation
- Uses `createSharedComposable` internally so only there is only shared instance at a time and event listeners are torn down when no more subscribers.
