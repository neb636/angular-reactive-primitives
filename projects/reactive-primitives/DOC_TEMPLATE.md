# Documentation Template

## How to Add Documentation for a New Function

When you create a new composable, effect, or utility function, follow these steps to add documentation:

### 1. Create a `.doc.ts` file

Create a file with the same name as your function, but with `.doc.ts` extension instead of `.composable.ts`, `.effect.ts`, etc.

**Example:** If you created `use-my-feature.composable.ts`, create `use-my-feature.doc.ts` in the same directory.

### 2. Use this template

```typescript
import { DocMetadata, DocEntry } from '../doc-metadata.type'; // Adjust path as needed
import sourceCodeRaw from './your-function-file.ts?raw';

export const metadata: DocMetadata = {
  name: 'yourFunctionName',
  title: 'yourFunctionName',
  description: 'A brief description of what this function does and when to use it.',
  category: 'composables', // or 'effects' or 'utils'
  subcategory: 'general', // or 'browser', 'activated-route', 'storage', etc.
  parameters: [
    {
      name: 'paramName',
      type: 'ParamType',
      description: 'What this parameter does',
      optional: false, // Set to true if optional
      defaultValue: undefined, // e.g., '300' or 'true'
    },
    // Add more parameters as needed
  ],
  returnType: 'Signal<ReturnType>', // Optional
  returnDescription: 'What the function returns', // Optional
};

export const sourceCode = sourceCodeRaw;

export const exampleCode = \`import { Component } from '@angular/core';
import { yourFunctionName } from 'reactive-primitives';

@Component({
  selector: 'example',
  template: \\\`
    <!-- Your example template -->
  \\\`
})
export class ExampleComponent {
  // Your example usage
  constructor() {
    const result = yourFunctionName(/* params */);
  }
}\`;

export const docEntry: DocEntry = {
  metadata,
  sourceCode,
  exampleCode,
};
```

### 3. Category and Subcategory Guide

**Categories:**

- `composables` - Reusable composable functions
- `effects` - Side effect functions
- `utils` - Utility functions

**Subcategories:**

- `general` - General purpose functions (default)
- `browser` - Browser-related functions (e.g., document, window)
- `activated-route` - Router-related functions
- `storage` - Storage-related functions
- `other` - Other functions

### 4. Build and Test

The documentation system automatically discovers all `.doc.ts` files and generates routes.

Run the dev server to see your documentation:

```bash
npm run docs:dev
```

Or build the documentation site:

```bash
npm run docs:build
```

### 5. Example

See existing `.doc.ts` files for reference:

- `lib/composables/use-debounced-signal.doc.ts`
- `lib/effects/sync-local-storage.doc.ts`
- `lib/composables/browser/use-document-visibility.doc.ts`

## Tips

1. **Write clear descriptions** - Help users understand when and why to use the function
2. **Provide realistic examples** - Show actual use cases, not just syntax
3. **Document all parameters** - Include types, descriptions, and default values
4. **Use proper subcategories** - This helps organize the documentation navigation
5. **Test your examples** - Make sure the example code actually works

## Automatic Features

The documentation system automatically:

- Discovers all `.doc.ts` files
- Generates routes based on categories and subcategories
- Displays source code from the actual implementation
- Creates navigation based on the metadata
- Updates when you add new `.doc.ts` files (just refresh the page)
