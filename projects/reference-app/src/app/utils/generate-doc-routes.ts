import { Routes } from '@angular/router';
import {
  DocRegistry,
  DocCategory,
  DocSubcategory,
  DocEntry,
} from 'reactive-primitives';
import { DynamicDocPageComponent } from '../pages/dynamic-doc-page.component';
import { getDocRegistry } from './doc-registry-generator';

interface RouteGroup {
  [subcategory: string]: Routes;
}

interface CategoryRoutes {
  [category: string]: RouteGroup;
}

/**
 * Converts a string to kebab-case for use in URLs
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Gets a human-readable title for a subcategory
 */
function getSubcategoryTitle(subcategory: DocSubcategory | undefined): string {
  if (!subcategory || subcategory === 'other') {
    return 'Other';
  }

  const titles: Record<DocSubcategory, string> = {
    general: 'General',
    browser: 'Browser',
    'activated-route': 'Activated Route',
    storage: 'Storage',
    other: 'Other',
  };

  return titles[subcategory] || subcategory;
}

/**
 * Gets a human-readable title for a category
 */
function getCategoryTitle(category: DocCategory): string {
  const titles: Record<DocCategory, string> = {
    composables: 'Composables',
    effects: 'Effects',
    utils: 'Utils',
  };

  return titles[category];
}

/**
 * Generates Angular routes from the documentation registry
 */
export function generateDocRoutes(): Routes {
  const registry = getDocRegistry();

  // Organize docs by category and subcategory
  const organized: CategoryRoutes = {};

  for (const [key, entry] of Object.entries(registry)) {
    const docEntry = entry as DocEntry;
    const { category, subcategory } = docEntry.metadata;
    const sub = subcategory || 'general';

    if (!organized[category]) {
      organized[category] = {};
    }

    if (!organized[category][sub]) {
      organized[category][sub] = [];
    }

    const path = toKebabCase(key);

    organized[category][sub].push({
      path,
      component: DynamicDocPageComponent,
      title: docEntry.metadata.title,
      data: { docEntry },
    });
  }

  // Build the final route structure
  const routes: Routes = [];

  for (const [category, subcategories] of Object.entries(organized)) {
    const categoryRoutes: Routes = [];

    // Check if we have subcategories or just one group
    const subcategoryKeys = Object.keys(subcategories);

    if (subcategoryKeys.length === 1 && subcategoryKeys[0] === 'general') {
      // Flat structure - no subcategories needed
      categoryRoutes.push(...subcategories['general']);
    } else {
      // Nested structure with subcategories
      for (const [subcategory, subRoutes] of Object.entries(subcategories)) {
        if (subcategory === 'general') {
          // Add general items at the root level
          categoryRoutes.push(...subRoutes);
        } else {
          // Create a subcategory parent route
          categoryRoutes.push({
            path: toKebabCase(subcategory),
            title: getSubcategoryTitle(subcategory as DocSubcategory),
            children: subRoutes,
          });
        }
      }
    }

    routes.push({
      path: category,
      title: getCategoryTitle(category as DocCategory),
      children: categoryRoutes,
    });
  }

  return routes;
}

/**
 * Gets the navigation routes (same as doc routes but for the nav menu)
 */
export function getNavigationRoutes(): Routes {
  return generateDocRoutes();
}
