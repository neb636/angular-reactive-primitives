# Dynamic Documentation System

## Overview

This project now includes a dynamic documentation system that automatically discovers and generates documentation pages from `.doc.ts` files located next to each composable, effect, and utility function in the reactive-primitives library.

## How It Works

### Auto-Discovery

The system uses Vite's `import.meta.glob` feature to automatically discover all `.doc.ts` files in the library at build time. No manual registration is required - just add a `.doc.ts` file and it will be automatically included.

### Route Generation

Routes are dynamically generated based on the metadata in each `.doc.ts` file, organized by:

- **Category** (composables, effects, utils)
- **Subcategory** (general, browser, activated-route, storage, etc.)

### Dynamic Rendering

A single `DynamicDocPageComponent` renders all documentation pages, receiving the documentation data through Angular route data.

## File Structure

```
projects/
├── reactive-primitives/
│   └── src/
│       └── lib/
│           ├── doc-metadata.type.ts          # Type definitions
│           ├── composables/
│           │   ├── use-debounced-signal.composable.ts
│           │   ├── use-debounced-signal.doc.ts  # Documentation
│           │   └── browser/
│           │       ├── use-document-visibility.composable.ts
│           │       └── use-document-visibility.doc.ts
│           └── effects/
│               ├── sync-local-storage.effect.ts
│               └── sync-local-storage.doc.ts
│
└── reference-app/
    └── src/
        └── app/
            ├── pages/
            │   └── dynamic-doc-page.component.ts  # Single doc component
            └── utils/
                ├── doc-registry-generator.ts      # Auto-discovery
                └── generate-doc-routes.ts          # Route generation
```

## Creating Documentation

See `projects/reactive-primitives/DOC_TEMPLATE.md` for a complete guide and template.

### Quick Example

```typescript
// use-my-feature.doc.ts
import { DocMetadata, DocEntry } from '../doc-metadata.type';
import sourceCodeRaw from './use-my-feature.composable.ts?raw';

export const metadata: DocMetadata = {
  name: 'useMyFeature',
  title: 'useMyFeature',
  description: 'Does something awesome',
  category: 'composables',
  subcategory: 'general',
  parameters: [
    {
      name: 'value',
      type: 'string',
      description: 'The value to use',
    },
  ],
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = \`
// Your example code here
\`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
```

## NPM Scripts

```bash
# Start development server with documentation
npm run docs:dev

# Build documentation site
npm run docs:build

# Also works with the regular start command
npm start
```

## Current Documentation Files

The following documentation files are currently available:

### Composables

- ✅ `use-debounced-signal.doc.ts` (general)
- ✅ `use-throttled-signal.doc.ts` (general)
- ✅ `use-document-visibility.doc.ts` (browser)

### Effects

- ✅ `sync-local-storage.doc.ts`
- ✅ `log-changes.doc.ts`

## Features

1. **Auto-Discovery**: Automatically finds all `.doc.ts` files
2. **Source Code Display**: Imports actual source code using Vite's `?raw` import
3. **Dynamic Routes**: Routes are generated based on categories and subcategories
4. **Type-Safe**: Full TypeScript support with documented types
5. **Single Component**: One reusable component renders all docs
6. **Easy to Extend**: Just add a `.doc.ts` file and it's automatically included

## Migration Notes

The old static documentation components in `projects/reference-app/src/app/pages/` can be gradually removed as you migrate to the new system. The dynamic system is now handling all routes defined in the `.doc.ts` files.

### Old Files to Remove (Eventually)

Once all functions have `.doc.ts` files:

- `projects/reference-app/src/app/pages/composables/*-page.component.ts`
- `projects/reference-app/src/app/pages/composables/*-page.code.ts`
- `projects/reference-app/src/app/pages/effects/*-page.component.ts`

## Technical Details

### Import.meta.glob

The system uses Vite's `import.meta.glob` with the `eager` option to load all documentation at build time:

```typescript
const docModules = import.meta.glob<{ docEntry: DocEntry }>(
  '/projects/reactive-primitives/src/lib/**/*.doc.ts',
  { eager: true },
);
```

### Raw Imports

Source code is imported using Vite's `?raw` suffix:

```typescript
import sourceCodeRaw from './my-function.ts?raw';
```

This imports the file as a plain text string, which is then displayed in the documentation.

### Route Data

Documentation data is passed through Angular's route data:

```typescript
{
  path: 'use-debounced-signal',
  component: DynamicDocPageComponent,
  data: { docEntry }
}
```

## Benefits

1. **No Duplication**: Source code is imported directly, no manual copying
2. **Scalable**: Automatically handles any number of functions
3. **Consistent**: All documentation follows the same structure
4. **Maintainable**: Documentation lives next to the source code
5. **Fast**: All documentation is loaded at build time (eager loading)

## Future Enhancements

Potential improvements:

- [ ] Add search functionality across all documentation
- [ ] Generate table of contents from all available functions
- [ ] Add "Related Functions" section
- [ ] Include interactive code examples
- [ ] Generate API reference from TypeScript types
- [ ] Add category landing pages with overviews
