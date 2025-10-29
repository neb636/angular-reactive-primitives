# Angular Reactive Primitives

A collection of small, reusable reactive building blocks for modern Angular (v20+) applications. The focus is on simple, well-typed composables and effects built around signals that you can drop into real projects with minimal ceremony.

## What you can do

- Transform signals: debounce, throttle, track previous values, and derive state.
- Observe the browser environment: respond to media queries, window size changes, and document visibility.
- Work with router state as signals: access route parameters, query parameters, fragments, and route data.
- Synchronize side effects safely: keep URL query parameters and local storage in sync with application state, and log changes during development.

## Status

- Work in progress. The primitives are not published yet; treat this repository as a source of copy‑and‑paste utilities or consume the library locally.

## Getting started

- Install dependencies:
```bash
npm install
```

- Run the reference app for live examples:
```bash
npm run start
```

- Build the library:
```bash
npm run build
```

- Run tests:
```bash
npm run test
```

- Develop documentation locally:
```bash
npm run docs:dev
```

## Design guidelines

- Signals first: prefer `signal()` and `computed()` for state and derivations.
- Small, focused APIs with clear responsibilities.
- OnPush change detection and simple, predictable state transformations.

## Project structure

- `projects/reactive-primitives` — library source and primitives
- `projects/reference-app` — sample application and docs viewer
- `scripts` — internal scripts used to compile docs and generate routes

## Compatibility

- Angular 20+
- TypeScript 5.9+
- RxJS 7.8+

## License

- MIT
