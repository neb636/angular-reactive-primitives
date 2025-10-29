# Documentation Markdown Guide

## Overview

Documentation is written in Markdown (`.doc.md` files) and compiled into Angular component files automatically. The markdown format is simple and author-friendly.

## Creating Documentation

### 1. Create a `.doc.md` file

Place the markdown file in the same directory as your function:

```
projects/reactive-primitives/src/lib/composables/
├── activated-route/
│   └── use-route-params/
│       ├── use-route-params.composable.ts
│       └── use-route-params.doc.md  ← Documentation
```

### 2. Markdown Structure

````markdown
# FunctionName

Brief description of what this function does and when to use it. This becomes the description shown at the top of the documentation page.

## Section Title

### Example 1 Title

\```ts
// Your example code here
\```

### Example 2 Title

\```ts
// Another example
\```
````

**Structure Rules:**

- **H1 (`#`)** = Function/Feature Title
- **First paragraph** = Description (appears below title)
- **H2 (`##`)** = Section headings (e.g., "Usage", "Examples")
- **H3 (`###`)** = Code block titles (appears above each code block)
- **Code blocks** = Examples with syntax highlighting

### 3. Example Template

````markdown
# useMyFeature

A composable that does something useful. This description explains when and why you would use this function in your Angular application.

## Usage

### Basic Example

\```ts
import { Component } from '@angular/core';
import { useMyFeature } from 'angular-reactive-primitives';

@Component({
selector: 'my-component',
template: `<div>{{ myValue() }}</div>`
})
export class MyComponent {
myValue = useMyFeature();
}
\```

### Advanced Example

\```ts
import { Component, computed } from '@angular/core';
import { useMyFeature } from 'angular-reactive-primitives';

@Component({
selector: 'advanced-component',
template: `<div>{{ result() }}</div>`
})
export class AdvancedComponent {
myValue = useMyFeature();
result = computed(() => this.myValue() \* 2);
}
\```
````

## Compilation

### Automatic Compilation

The documentation markdown files are automatically compiled before running the dev server or building:

```bash
# Compile docs and start dev server
npm run docs:dev

# Compile docs and build for production
npm run docs:build

# Just compile without building
npm run compile:docs
```

### What Gets Generated

The compiler generates Angular component files in `projects/reference-app/src/app/pages/`:

```
Input:  use-route-params.doc.md
Output: use-route-params-page.component.ts
```

The generated component includes:

- Title and description from markdown
- All code examples as template variables
- Source code automatically imported and appended
- Proper Angular component structure

### Source Code Section

The **Source Code** section is automatically added to every documentation page. The compiler:

1. Finds the corresponding source file (`.composable.ts`, `.effect.ts`, etc.)
2. Reads the actual implementation code
3. Appends it to the documentation as a "Source Code" section

**You don't need to include source code in the markdown - it's automatic!**

## Routing

After compiling, you need to manually add the route to `app.routes.ts`:

```typescript
import { UseMyFeaturePageComponent } from './pages/composables/use-my-feature-page.component';

const COMPOSABLE_ROUTES: Routes = [
  {
    path: 'use-my-feature',
    component: UseMyFeaturePageComponent,
    title: 'useMyFeature',
  },
  // ... other routes
];
```

## Tips & Best Practices

### Writing Good Descriptions

✅ **Good:**

```markdown
# useRouteParams

A convenience function that wraps Angular's ActivatedRoute.params, exposing all route parameters as a signal-based object. This is useful when you need to access multiple route parameters at once or work with the entire parameter object reactively.
```

❌ **Bad:**

```markdown
# useRouteParams

Gets route params.
```

### Code Examples

1. **Show realistic use cases** - Not just syntax, but actual problems being solved
2. **Include imports** - Show what needs to be imported
3. **Add comments** - Explain non-obvious parts
4. **Progressive complexity** - Start simple, then show advanced usage

### Organization

Group related examples under clear H3 headings:

````markdown
## Usage

### With Resource API

\```ts
// Example using Angular's resource()
\```

### With Computed Signals

\```ts
// Example using computed()
\```

### In Guards

\```ts
// Example in a route guard
\```
````

## File Naming Convention

The function name becomes the page component name automatically:

| Function Name        | Markdown File                 | Generated Component                      |
| -------------------- | ----------------------------- | ---------------------------------------- |
| `useRouteParams`     | `use-route-params.doc.md`     | `use-route-params-page.component.ts`     |
| `useDebouncedSignal` | `use-debounced-signal.doc.md` | `use-debounced-signal-page.component.ts` |
| `syncLocalStorage`   | `sync-local-storage.doc.md`   | `sync-local-storage-page.component.ts`   |

## Example: Complete Documentation

Here's a complete example showing all features:

````markdown
# useDocumentVisibility

Creates a signal that tracks whether the document/tab is visible or hidden. The signal updates when the user switches tabs or minimizes the window.

## Usage

### Basic Visibility Tracking

\```ts
import { Component, effect } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
selector: 'visibility-tracker',
template: \`
@if (isVisible()) {
<div>Tab is active</div>
} @else {
<div>Tab is inactive</div>
}
\`
})
export class VisibilityTrackerComponent {
isVisible = useDocumentVisibility();
}
\```

### Pause Video When Hidden

\```ts
import { Component, effect, viewChild } from '@angular/core';
import { useDocumentVisibility } from 'angular-reactive-primitives';

@Component({
selector: 'video-player',
template: \`<video #videoEl src="movie.mp4"></video>\`
})
export class VideoPlayerComponent {
videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
isVisible = useDocumentVisibility();

constructor() {
effect(() => {
const video = this.videoEl()?.nativeElement;
if (!video) return;

      if (this.isVisible()) {
        video.play();
      } else {
        video.pause();
      }
    });

}
}
\```
````

## Workflow

1. **Write** documentation in markdown
2. **Compile** using `npm run compile:docs`
3. **Add route** to `app.routes.ts`
4. **Test** with `npm run docs:dev`
5. **Commit** both `.doc.md` and generated `.component.ts`

## Troubleshooting

### Source code not found

Make sure your source file is in the same directory as the `.doc.md` file and follows naming conventions:

- `*.composable.ts`
- `*.effect.ts`
- `*.ts`

### Code block not showing

- Ensure your code block starts with ` ```ts ` or ` ```typescript `
- Make sure you have an H3 heading before the code block
- Check that the code block ends with ` ``` `

### Title or description missing

- Ensure H1 (`#`) is the first heading in the file
- Make sure there's a paragraph after the H1 before any H2 headings

## Future Enhancements

Potential additions:

- Front-matter for metadata (category, tags, etc.)
- Interactive code playgrounds
- Automatic parameter extraction from source code
- Cross-references between functions
- Search functionality
