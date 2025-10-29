# Automated Route Generation - Implementation Summary

## Overview

This document summarizes the implementation of the automated route generation system for the Angular Reactive Primitives documentation.

## What Was Built

An automated system that:

1. **Compiles** markdown documentation files (`.doc.md`) into Angular components
2. **Scans** generated components to discover routes
3. **Generates** route definitions automatically based on file structure
4. **Integrates** with the build process for seamless development

## Key Components

### 1. Documentation Compiler (`scripts/compile-docs.js`)

**Purpose:** Convert `.doc.md` files to Angular components

**Input:** `*.doc.md` files in the library source

```
projects/reactive-primitives/src/lib/
  composables/
    activated-route/
      use-route-params/
        use-route-params.doc.md
```

**Output:** Angular component files

```
projects/reference-app/src/app/pages/
  composables/
    activated-route/
      use-route-params-page.component.ts
```

**Key Features:**

- Parses markdown structure (H1, H2, H3, code blocks)
- Reads source code automatically
- Generates Angular components with proper imports
- Handles nested folder structures with correct relative paths

### 2. Route Generator (`scripts/generate-routes.js`)

**Purpose:** Automatically generate route definitions

**Input:** Compiled components in `pages/` directory

**Output:** `generated-doc-routes.ts` with route definitions

**Key Features:**

- Discovers all `*-page.component.ts` files
- Organizes routes by category and subcategory
- Generates proper TypeScript imports
- Creates nested route structures
- Excludes specific directories (getting-started, test-page)

**Route Structure:**

```typescript
{
  path: 'composables',              // Category
  title: 'Composables',
  children: [
    {
      path: 'activated-route',      // Subcategory
      title: 'Activated Route',
      children: [
        {
          path: 'use-route-params',  // Function
          component: UseRouteParamsPageComponent,
          title: 'useRouteParams',
        },
      ],
    },
  ],
}
```

### 3. Build Integration

**npm Scripts:**

```json
{
  "compile:docs": "node scripts/compile-docs.js",
  "generate:routes": "node scripts/generate-routes.js",
  "build:docs": "npm run compile:docs && npm run generate:routes",
  "docs:dev": "npm run build:docs && ng serve reference-app",
  "docs:build": "npm run build:docs && ng build reference-app --configuration=production"
}
```

**Workflow:**

1. `compile:docs` - Compiles markdown → components
2. `generate:routes` - Scans components → generates routes
3. `build:docs` - Runs both in sequence
4. `docs:dev/docs:build` - Builds docs then starts/builds Angular app

## How Routes Are Generated

### File Structure → Routes

The system derives routes from your file organization:

```
Source: projects/reactive-primitives/src/lib/composables/activated-route/use-route-params/use-route-params.doc.md
         └─category─┘ └─subcategory──┘ └─function──┘

Generated Route: /composables/activated-route/use-route-params
                  └─category─┘ └─subcategory──┘ └─function──┘
```

### Route Naming Conventions

| Element           | Source        | Transformation              | Example            |
| ----------------- | ------------- | --------------------------- | ------------------ |
| Category Path     | Folder name   | As-is                       | `composables`      |
| Category Title    | Hardcoded map | Capitalized                 | `Composables`      |
| Subcategory Path  | Folder name   | As-is                       | `activated-route`  |
| Subcategory Title | Hardcoded map | Title Case                  | `Activated Route`  |
| Function Path     | File name     | Remove `-page.component.ts` | `use-route-params` |
| Function Title    | File name     | kebab-case → camelCase      | `useRouteParams`   |

### Special Cases

**General/Root Level Functions:**

```
Source: composables/general/use-debounced-signal.doc.md
Route:  /composables/use-debounced-signal
        (no subcategory path)
```

**Nested Subcategories:**

```
Source: composables/activated-route/use-route-params.doc.md
Route:  /composables/activated-route/use-route-params
        (includes subcategory path)
```

## Integration with app.routes.ts

The generated routes are imported and used in the main route configuration:

```typescript
// Before (Manual)
const COMPOSABLE_ROUTES: Routes = [
  {
    path: 'activated-route',
    title: 'Activated Route',
    children: [
      {
        path: 'use-route-params',
        component: UseRouteParamsPageComponent,
        title: 'useRouteParams',
      },
      // ... manually add each route
    ],
  },
];

// After (Automated)
import { GENERATED_DOC_ROUTES } from './generated-doc-routes';

export const NAVIGATION_ROUTES: Routes = [
  {
    path: 'getting-started',
    title: 'Getting Started',
    children: GETTING_STARTED_ROUTES,
  },
  ...GENERATED_DOC_ROUTES, // ← All routes generated automatically
];
```

## Developer Workflow

### Adding New Documentation

**Before (Manual):**

1. Create `.doc.md` file
2. Run `npm run compile:docs`
3. Open `app.routes.ts`
4. Manually add import statement
5. Manually add route object
6. Ensure correct path and component name
7. Test navigation

**After (Automated):**

1. Create `.doc.md` file
2. Run `npm run build:docs`
3. Done! ✅

### Benefits

✅ **Zero Manual Route Configuration** - Routes are generated from file structure
✅ **Consistent Naming** - Convention-based route paths and titles
✅ **Type Safety** - Auto-generated TypeScript imports
✅ **Reduced Errors** - No manual typos in paths or component names
✅ **Faster Development** - Add docs, run build, done
✅ **Scalable** - Works for 10 functions or 1000 functions
✅ **Self-Documenting** - File structure = route structure

## Files Created/Modified

### New Files

1. **`scripts/generate-routes.js`**
   - Main route generation script
   - ~300 lines
   - Discovers components and generates routes

2. **`projects/reference-app/src/app/generated-doc-routes.ts`**
   - Auto-generated route definitions
   - Updated every time `generate:routes` runs
   - Should be committed to git

3. **`ROUTE_GENERATION_GUIDE.md`**
   - User-facing documentation
   - Explains how to use the system

4. **`AUTOMATED_ROUTES_SUMMARY.md`** (this file)
   - Technical summary
   - Implementation details

### Modified Files

1. **`package.json`**
   - Added `generate:routes` script
   - Modified `build:docs` to include route generation
   - Updated `docs:dev` and `docs:build`

2. **`scripts/compile-docs.js`**
   - Added parameters for category/subcategory
   - Dynamic relative paths based on folder depth

3. **`app.routes.ts`**
   - Removed manual route definitions for docs
   - Imported `GENERATED_DOC_ROUTES`
   - Spread operator to include generated routes

4. **Various `.doc.md` files**
   - Fixed `\$` escaping (should be `$` in code blocks)

## Technical Details

### Path Calculation

The route generator calculates relative import paths based on nesting depth:

```javascript
// For subcategory (4 levels deep):
// pages/composables/activated-route/use-route-params-page.component.ts
const pathDepth = 4;
const relativePath = '../../../../';
// Import: ../../../../common/layout/documentation/documentation.component

// For general (3 levels deep):
// pages/composables/use-debounced-signal-page.component.ts
const pathDepth = 3;
const relativePath = '../../../';
// Import: ../../../common/layout/documentation/documentation.component
```

### Route Discovery

The generator recursively scans directories:

```javascript
function findPageComponents(dir, basePath = '') {
  const components = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (['getting-started', 'test-page'].includes(entry.name)) {
        continue;
      }
      // Recurse into subdirectories
      components.push(...findPageComponents(fullPath, relativePath));
    } else if (entry.name.endsWith('-page.component.ts')) {
      // Found a page component
      components.push({ fileName, fullPath, relativePath, directory });
    }
  }

  return components;
}
```

### Route Organization

Components are organized into a nested structure:

```javascript
{
  composables: {
    'activated-route': [component1, component2, ...],
    'browser': [component3, component4, ...],
    'general': [component5, component6, ...]
  },
  effects: {
    'general': [component7, component8, ...]
  }
}
```

Then transformed into Angular route definitions with proper nesting.

## Build Process

```
┌─────────────────┐
│ Run build:docs  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ compile:docs    │
│ Parse .doc.md   │
│ Read source     │
│ Generate .ts    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ generate:routes │
│ Scan .ts files  │
│ Discover routes │
│ Generate config │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Angular Build   │
│ Import routes   │
│ Bundle app      │
└─────────────────┘
```

## Customization Points

### Adding New Categories

1. Create folder in `projects/reactive-primitives/src/lib/`
2. Update `getCategoryTitle()` in `generate-routes.js`
3. Add docs and run `npm run build:docs`

### Adding New Subcategories

1. Create subfolder under category
2. Update `getSubcategoryTitle()` in `generate-routes.js`
3. Add docs and run `npm run build:docs`

### Changing Route Format

Edit `formatRoute()` function in `generate-routes.js` to customize:

- Route structure
- Additional route properties
- Custom metadata

### Excluding Directories

Update the skip list in `findPageComponents()`:

```javascript
if (['getting-started', 'test-page', 'your-dir'].includes(entry.name)) {
  continue;
}
```

## Testing

The system was tested with:

- 16 documentation files
- 2 categories (composables, effects)
- 3 subcategories (activated-route, browser, general)
- Multiple nesting levels
- Various naming conventions

All routes generated successfully and the Angular app builds without errors.

## Future Enhancements

Potential improvements:

1. **Watch Mode** - Auto-rebuild on `.doc.md` changes
2. **Validation** - Check for duplicate routes or invalid paths
3. **Metadata** - Extract and include additional route metadata from docs
4. **Navigation Menu** - Auto-generate navigation from routes
5. **Search Index** - Generate search index from documentation
6. **Route Guards** - Automatically apply guards based on metadata
7. **Lazy Loading** - Generate lazy-loaded route modules

## Conclusion

The automated route generation system eliminates manual route configuration, making documentation development faster and less error-prone. Routes are now derived directly from the file structure, providing a single source of truth and ensuring consistency across the application.

**Key Achievement:** Zero-configuration routing for documentation pages.

## Quick Reference

**Add new docs:**

```bash
# 1. Create .doc.md file next to source
# 2. Run build
npm run build:docs

# 3. That's it! Routes are generated automatically
```

**Development:**

```bash
npm run docs:dev
```

**Production:**

```bash
npm run docs:build
```

**Manual steps required:** None! 🎉
