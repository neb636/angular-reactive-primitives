# Angular Reactive Primitives

A collection of small, reusable reactive building blocks for modern Angular (v20+) applications. The focus is on simple, well-typed composables and effects built around signals that you can drop into real projects with minimal ceremony.

## 🚀 Features

- **Fully tree shakeable**: Only take what you want
- **Strongly typed**

## What you can do

- Transform signals: debounce, throttle, track previous values, and derive state.
- Observe the browser environment: respond to media queries, window size changes, and document visibility.
- Work with router state as signals: access route parameters, query parameters, fragments, and route data.
- Synchronize side effects safely: keep URL query parameters and local storage in sync with application state, and log changes during development.

## Status

This library is ready for publishing to npm. See the [Building and Publishing](#building-and-publishing) section below for instructions.

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

## Building and Publishing

### Build the Library

Build the library for distribution:

```bash
npm run build
```

Build artifacts are output to `dist/angular-reactive-primitives`.

### Publishing to npm

After building, you can publish the library:

```bash
cd dist/angular-reactive-primitives
npm publish
```

**Pre-publish checklist:**

- Ensure all tests pass (`npm run test`)
- Update version in `projects/angular-reactive-primitives/package.json`
- Update `CHANGELOG.md` with release notes
- Build succeeds without errors
- Review the contents of `dist/angular-reactive-primitives`

### Testing Locally

Before publishing, test the package locally:

```bash
# Build the library
npm run build

# Create a tarball
cd dist/angular-reactive-primitives
npm pack

# Install in another project
cd /path/to/test-project
npm install /path/to/angular-reactive-primitives-0.0.1.tgz
```

## Project structure

- `projects/angular-reactive-primitives` — library source and primitives
- `projects/documentation-site` — Documentation site
- `scripts` — internal scripts used to compile docs and generate routes

### Creating Documentation

1. Create a `.doc.md` file next to your library source file:

   ```
   projects/angular-reactive-primitives/src/lib/
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
   - Compiles your `.doc.md` into a component in `projects/documentation-site/src/app/pages/`
   - Scans all generated components
   - Generates route definitions in `generated-doc-routes.ts`

```bash
# Compile markdown to components
npm run compile:docs

# Compile + dev server
npm run docs:dev

# Compile + production build
npm run docs:build
```

## File Structure

```
projects/
├── angular-reactive-primitives/
│   └── src/lib/
│       └── composables/
│           └── use-my-feature/
│               ├── use-my-feature.composable.ts  # Implementation
│               └── use-my-feature.doc.md         # Documentation
│
└── documentation-site/
    └── src/app/
        ├── app.routes.ts                         # Routes (manual)
        └── pages/
            └── composables/
                └── use-my-feature-page.component.ts  # Generated!
```

## Compatibility

- Angular 20+

## License

- MIT
