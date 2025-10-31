# Reactive Primitives (Library)

This package contains the source for the Angular reactive primitives library. It provides composables and effects built on signals to help implement common UI and routing patterns.

## Build

```bash
ng build angular-reactive-primitives
```

Build artifacts are output to `dist/angular-reactive-primitives`.

## Publish (optional)

After building, you can publish the library when ready:

```bash
cd dist/angular-reactive-primitives
npm publish
```

## Test

```bash
ng test
```

## Notes

- This library targets modern Angular and embraces signals for state and derivations.
- Keep APIs small and focused; prefer clear composition over heavy abstractions.
