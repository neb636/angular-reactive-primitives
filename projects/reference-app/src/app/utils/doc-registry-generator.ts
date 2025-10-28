import { DocEntry, DocRegistry } from 'reactive-primitives';

/**
 * Auto-discovers all .doc.ts files from the reactive-primitives library
 * and creates a registry of documentation entries.
 *
 * This uses Vite's import.meta.glob feature to dynamically import
 * all documentation files at build time.
 */
export async function generateDocRegistry(): Promise<DocRegistry> {
  // Use import.meta.glob to find all .doc.ts files in the reactive-primitives library
  // The eager option loads them immediately rather than lazy loading
  const docModules = import.meta.glob<{ docEntry: DocEntry }>(
    '/projects/reactive-primitives/src/lib/**/*.doc.ts',
    { eager: true },
  );

  const registry: DocRegistry = {};

  // Process each discovered documentation file
  for (const [path, module] of Object.entries(docModules)) {
    if (module.docEntry) {
      const { metadata } = module.docEntry;
      registry[metadata.name] = module.docEntry;

      console.log(`[Doc Registry] Registered: ${metadata.name} from ${path}`);
    }
  }

  console.log(`[Doc Registry] Total entries: ${Object.keys(registry).length}`);

  return registry;
}

/**
 * Synchronous version that returns the registry immediately.
 * Use this if all imports are marked as eager.
 */
export function getDocRegistry(): DocRegistry {
  const docModules = import.meta.glob<{ docEntry: DocEntry }>(
    '/projects/reactive-primitives/src/lib/**/*.doc.ts',
    { eager: true },
  );

  const registry: DocRegistry = {};

  for (const [, module] of Object.entries(docModules)) {
    if (module.docEntry) {
      const { metadata } = module.docEntry;
      registry[metadata.name] = module.docEntry;
    }
  }

  return registry;
}
