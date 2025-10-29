# Documentation System

## Quick Start

### 1. Write Documentation (Markdown)

Create a `.doc.md` file next to your function:

````markdown
# useMyFeature

Brief description of what this does and when to use it.

## Usage

### Basic Example

\```ts
import { useMyFeature } from 'angular-reactive-primitives';

const result = useMyFeature();
\```

### Advanced Example

\```ts
// More complex usage...
\```
````

### 2. Compile

```bash
npm run compile:docs
```

This generates a component file: `use-my-feature-page.component.ts`

### 3. Add Route

Edit `app.routes.ts`:

```typescript
import { UseMyFeaturePageComponent } from './pages/composables/use-my-feature-page.component';

const COMPOSABLE_ROUTES: Routes = [
  {
    path: 'use-my-feature',
    component: UseMyFeaturePageComponent,
    title: 'useMyFeature',
  },
];
```

### 4. View Documentation

```bash
npm run docs:dev
```

Visit: `http://localhost:4200/composables/use-my-feature`

## Documentation

- **[DOC_MARKDOWN_GUIDE.md](DOC_MARKDOWN_GUIDE.md)** - Complete authoring guide
- **[MARKDOWN_DOCS_SUMMARY.md](MARKDOWN_DOCS_SUMMARY.md)** - Technical implementation details

## NPM Scripts

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
├── reactive-primitives/
│   └── src/lib/
│       └── composables/
│           └── use-my-feature/
│               ├── use-my-feature.composable.ts  # Implementation
│               └── use-my-feature.doc.md         # Documentation
│
└── reference-app/
    └── src/app/
        ├── app.routes.ts                         # Routes (manual)
        └── pages/
            └── composables/
                └── use-my-feature-page.component.ts  # Generated!
```

## Features

✅ **Markdown authoring** - Clean, readable format
✅ **Auto source code** - Automatically includes implementation
✅ **Static components** - No runtime overhead  
✅ **Type-safe** - Generated TypeScript components
✅ **Section-based** - Organized with H2/H3 headings
✅ **Pre-build compilation** - Integrated into workflow

## How It Works

```
┌─────────────┐
│  .doc.md    │  Write markdown documentation
│  (author)   │
└──────┬──────┘
       │
       │ npm run compile:docs
       │
       ▼
┌─────────────┐
│  compiler   │  Parse markdown, read source code
│  (Node.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ .component  │  Generated Angular component
│    .ts      │
└──────┬──────┘
       │
       │ npm run docs:build
       │
       ▼
┌─────────────┐
│  Built docs │  Production-ready documentation site
│    site     │
└─────────────┘
```

## Markdown Structure

````markdown
# Title ← Page title

Description paragraph... ← Page description

## Section Name ← Documentation section

### Code Block Title ← Title for code block

\```ts ← Code example
code here
\```
````

**Note:** Source Code section is automatically added - you don't need to include it!

## Example

See `projects/reactive-primitives/src/lib/composables/activated-route/use-route-params/use-route-params.doc.md` for a complete example.

## Troubleshooting

### Source code not showing

- Ensure source file is in same directory as `.doc.md`
- File should be named `*.composable.ts`, `*.effect.ts`, or `*.ts`

### Compilation errors

- Check markdown syntax (especially code block backticks)
- Ensure H1 (#) is first heading
- Verify code blocks are properly closed

### Route not found

- Make sure you added the route to `app.routes.ts`
- Component import path should match generated file location
- Run `npm run compile:docs` before building

## Old System (Deprecated)

The previous `.doc.ts` metadata-based system has been replaced. If you see references to:

- `.doc.ts` files with `DocMetadata` objects
- `doc-registry-generator.ts`
- `dynamic-doc-page.component.ts`
- `generateDocRoutes()`

These are from the old system and can be ignored/removed.

## Contributing Documentation

1. Create `.doc.md` file next to your function
2. Follow the structure in `DOC_MARKDOWN_GUIDE.md`
3. Run `npm run compile:docs` to generate component
4. Add route to `app.routes.ts`
5. Test with `npm run docs:dev`
6. Commit both `.doc.md` and generated `.component.ts`

---

For detailed information, see:

- **[DOC_MARKDOWN_GUIDE.md](DOC_MARKDOWN_GUIDE.md)** - How to write documentation
- **[MARKDOWN_DOCS_SUMMARY.md](MARKDOWN_DOCS_SUMMARY.md)** - Technical details
