# logChangesEffect

Development helper effect that logs signal changes to console. Useful for debugging and understanding signal behavior during development.

## Usage

```ts
import { logChangesEffect } from 'angular-reactive-primitives';

@Component({})
class ExampleComponent {
  searchQuery = signal('');
  selectedItems = signal<string[]>([]);

  constructor() {
    logChangesEffect({
      signal: this.searchQuery,
      label: 'Search Query',
    });

    logChangesEffect({
      signal: this.selectedItems,
      label: 'Selected Items',
      logLevel: 'warn',
    });
  }
}
```

## Parameters

| Parameter   | Type                                       | Default      | Description                                |
| ----------- | ------------------------------------------ | ------------ | ------------------------------------------ |
| `signal`    | `Signal<any>`                              | _required_   | The signal to log changes for              |
| `label`     | `string`                                   | `'Signal'`   | Optional label to identify the signal      |
| `logLevel`  | `'log' \| 'warn' \| 'error' \| 'info'`     | `'log'`      | Console method to use for logging          |

## Notes

- Each change is logged with a timestamp in ISO format
- Best used for development/debugging only
- The effect runs automatically whenever the signal changes
- Consider removing or disabling in production builds
