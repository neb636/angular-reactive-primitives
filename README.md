# Angular Reactive Primitives

A collection of small, reusable reactive building blocks for modern Angular (v20+) applications. The focus is on simple, well-typed composables and effects built around signals that you can drop into real projects with minimal ceremony.

## 🚀 Features

- 🎪 [**Interactive docs & demos**](https://vueuse.org)
- ⚡ **Fully tree shakeable**: Only take what you want,
- 🦾 **Type Strong**: Written in [TypeScript](https://www.typescriptlang.org/), with [TS Docs](https://github.com/microsoft/tsdoc)

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

- Run the Documentation site for live examples:

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

## Project structure

- `projects/reactive-primitives` — library source and primitives
- `projects/reference-app` — Documentation site
- `scripts` — internal scripts used to compile docs and generate routes

### Creating Documentation

1. Create a `.doc.md` file next to your library source file:

   ```
   projects/reactive-primitives/src/lib/
     composables/
       my-feature/
         my-feature.composable.ts
         my-feature.doc.md       ← Create this
   ```

2. Write your documentation in markdown (see `DOC_TEMPLATE.md` for format)

3. Run the build command:

   ```bash
   npm run build:docs
   ```

4. The system automatically:
   - Compiles your `.doc.md` into a component in `projects/reference-app/src/app/pages/`
   - Scans all generated components
   - Generates route definitions in `generated-doc-routes.ts`

## Compatibility

- Angular 20+

## License

- MIT
