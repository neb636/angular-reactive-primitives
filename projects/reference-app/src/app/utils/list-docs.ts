/**
 * Utility script to list all discovered documentation entries.
 * Run this to verify which .doc.ts files are being discovered.
 */

import { getDocRegistry } from './doc-registry-generator';

export function listAllDocs() {
  console.log('\n=== Discovered Documentation ===\n');

  const registry = getDocRegistry();
  const entries = Object.values(registry);

  if (entries.length === 0) {
    console.log('No documentation files found.');
    return;
  }

  // Group by category
  const byCategory: Record<string, typeof entries> = {};

  for (const entry of entries) {
    const category = entry.metadata.category;
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(entry);
  }

  // Display grouped by category
  for (const [category, docs] of Object.entries(byCategory)) {
    console.log(`\n${category.toUpperCase()}:`);

    // Group by subcategory
    const bySubcategory: Record<string, typeof docs> = {};

    for (const doc of docs) {
      const sub = doc.metadata.subcategory || 'general';
      if (!bySubcategory[sub]) {
        bySubcategory[sub] = [];
      }
      bySubcategory[sub].push(doc);
    }

    for (const [subcategory, subDocs] of Object.entries(bySubcategory)) {
      if (subcategory !== 'general') {
        console.log(`  ${subcategory}:`);
      }

      for (const doc of subDocs) {
        const prefix = subcategory !== 'general' ? '    ' : '  ';
        console.log(`${prefix}✓ ${doc.metadata.name}`);
      }
    }
  }

  console.log(`\nTotal: ${entries.length} documentation entries\n`);
}
