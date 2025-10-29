#!/usr/bin/env node

/**
 * Route Generator
 *
 * Automatically generates Angular routes from compiled documentation components.
 * This script scans for generated *-page.component.ts files and creates route definitions.
 */

const fs = require('fs');
const path = require('path');

const PAGES_PATH = path.join(
  __dirname,
  '../projects/reference-app/src/app/compiled-pages',
);
const ROUTES_OUTPUT = path.join(
  __dirname,
  '../projects/reference-app/src/app/generated-doc-routes.ts',
);

/**
 * Find all *-page.component.ts files
 */
function findPageComponents(dir, basePath = '') {
  const components = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      // Skip certain directories
      if (['getting-started', 'test-page'].includes(entry.name)) {
        continue;
      }
      components.push(...findPageComponents(fullPath, relativePath));
    } else if (entry.name.endsWith('-page.component.ts')) {
      components.push({
        fileName: entry.name,
        fullPath,
        relativePath,
        directory: basePath,
      });
    }
  }

  return components;
}

/**
 * Extract component class name from file
 */
function extractComponentClassName(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/export class (\w+Component)/);
  return match ? match[1] : null;
}

/**
 * Convert component file name to route path
 * e.g., use-route-params-page.component.ts -> use-route-params
 */
function getRoutePath(fileName) {
  return fileName.replace('-page.component.ts', '');
}

/**
 * Convert component file name to title
 * e.g., use-route-params-page.component.ts -> useRouteParams
 */
function getRouteTitle(fileName) {
  const path = getRoutePath(fileName);
  // Convert kebab-case to camelCase
  return path.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get import path for component
 */
function getImportPath(relativePath) {
  return `./pages/${relativePath.replace(/\\/g, '/')}`.replace('.ts', '');
}

/**
 * Determine category from directory structure
 */
function getCategoryFromPath(directory) {
  const parts = directory.split(path.sep).filter(Boolean);

  if (parts.length === 0) return { category: 'general', subcategory: null };

  const category = parts[0]; // composables, effects, utils
  const subcategory = parts[1] || null; // activated-route, browser, etc.

  return { category, subcategory };
}

/**
 * Organize components by category and subcategory
 */
function organizeComponents(components) {
  const organized = {};

  for (const component of components) {
    const { category, subcategory } = getCategoryFromPath(component.directory);

    if (!organized[category]) {
      organized[category] = {};
    }

    const subKey = subcategory || 'general';
    if (!organized[category][subKey]) {
      organized[category][subKey] = [];
    }

    organized[category][subKey].push(component);
  }

  return organized;
}

/**
 * Get category title
 */
function getCategoryTitle(category) {
  const titles = {
    composables: 'Composables',
    effects: 'Effects',
    utils: 'Utils',
  };
  return titles[category] || category;
}

/**
 * Get subcategory title
 */
function getSubcategoryTitle(subcategory) {
  if (!subcategory || subcategory === 'general') return null;

  const titles = {
    'activated-route': 'Activated Route',
    browser: 'Browser',
    storage: 'Storage',
  };

  return titles[subcategory] || subcategory;
}

/**
 * Generate route configuration code
 */
function generateRouteCode(organized, components) {
  let imports = [];
  let routes = [];

  // Generate imports
  for (const component of components) {
    const className = extractComponentClassName(component.fullPath);
    const importPath = getImportPath(component.relativePath);
    imports.push(`import { ${className} } from '${importPath}';`);
  }

  // Generate routes by category
  for (const [category, subcategories] of Object.entries(organized)) {
    const categoryRoutes = [];
    const subcategoryKeys = Object.keys(subcategories);

    // Check if we should use flat or nested structure
    if (subcategoryKeys.length === 1 && subcategoryKeys[0] === 'general') {
      // Flat structure
      for (const component of subcategories['general']) {
        const className = extractComponentClassName(component.fullPath);
        const routePath = getRoutePath(component.fileName);
        const title = getRouteTitle(component.fileName);

        categoryRoutes.push({
          path: routePath,
          component: className,
          title,
        });
      }
    } else {
      // Nested structure with subcategories
      for (const [subcategory, components] of Object.entries(subcategories)) {
        if (subcategory === 'general') {
          // Add general items at root level
          for (const component of components) {
            const className = extractComponentClassName(component.fullPath);
            const routePath = getRoutePath(component.fileName);
            const title = getRouteTitle(component.fileName);

            categoryRoutes.push({
              path: routePath,
              component: className,
              title,
            });
          }
        } else {
          // Create subcategory group
          const subRoutes = [];
          for (const component of components) {
            const className = extractComponentClassName(component.fullPath);
            const routePath = getRoutePath(component.fileName);
            const title = getRouteTitle(component.fileName);

            subRoutes.push({
              path: routePath,
              component: className,
              title,
            });
          }

          categoryRoutes.push({
            path: subcategory,
            title: getSubcategoryTitle(subcategory),
            children: subRoutes,
          });
        }
      }
    }

    routes.push({
      path: category,
      title: getCategoryTitle(category),
      children: categoryRoutes,
    });
  }

  return { imports, routes };
}

/**
 * Format route object to TypeScript code
 */
function formatRoute(route, indent = 2) {
  const spaces = ' '.repeat(indent);
  let result = `${spaces}{\n`;

  result += `${spaces}  path: '${route.path}',\n`;

  if (route.component) {
    result += `${spaces}  component: ${route.component},\n`;
  }

  if (route.title) {
    result += `${spaces}  title: '${route.title}',\n`;
  }

  if (route.children) {
    result += `${spaces}  children: [\n`;
    for (const child of route.children) {
      result += formatRoute(child, indent + 4);
      result += ',\n';
    }
    result += `${spaces}  ],\n`;
  }

  result += `${spaces}}`;
  return result;
}

/**
 * Generate the routes file
 */
function generateRoutesFile() {
  console.log('🔧 Generating routes...\n');

  // Find all page components
  const components = findPageComponents(PAGES_PATH);

  if (components.length === 0) {
    console.log('⚠️  No page components found');
    return;
  }

  console.log(`Found ${components.length} component(s)\n`);

  // Organize by category/subcategory
  const organized = organizeComponents(components);

  // Generate route code
  const { imports, routes } = generateRouteCode(organized, components);

  // Build the output file
  let output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated by: scripts/generate-routes.js
 * Generated at: ${new Date().toISOString()}
 *
 * This file contains dynamically generated routes for documentation pages.
 * Run 'npm run generate-routes' to regenerate this file.
 */

import { Routes } from '@angular/router';

${imports.join('\n')}

export const GENERATED_DOC_ROUTES: Routes = [
`;

  for (const route of routes) {
    output += formatRoute(route);
    output += ',\n';
  }

  output += '];\n';

  // Write the file
  fs.writeFileSync(ROUTES_OUTPUT, output);

  const relativeOutput = path.relative(process.cwd(), ROUTES_OUTPUT);
  console.log(`✅ Routes generated: ${relativeOutput}\n`);
  console.log(`📊 Summary:`);
  console.log(`   - ${components.length} components`);
  console.log(`   - ${routes.length} categories`);
  console.log(`   - ${imports.length} imports\n`);
}

// Run the generator
generateRoutesFile();
