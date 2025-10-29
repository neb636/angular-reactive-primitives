#!/usr/bin/env node

/**
 * Documentation Compiler
 *
 * Compiles .doc.md markdown files into Angular component files.
 * Each markdown file is transformed into a static documentation page component.
 */

const fs = require('fs');
const path = require('path');

// Paths
const LIB_PATH = path.join(
  __dirname,
  '../projects/reactive-primitives/src/lib',
);
const PAGES_PATH = path.join(
  __dirname,
  '../projects/reference-app/src/app/compiled-pages',
);

/**
 * Find all .doc.md files in the library
 */
function findDocMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findDocMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.doc.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse markdown content into structured data
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  let title = '';
  let description = '';
  let sections = [];
  let currentSection = null;
  let currentCodeBlock = null;
  let isInCodeBlock = false;
  let descriptionComplete = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!isInCodeBlock) {
        // Start of code block
        isInCodeBlock = true;
        const language = line.slice(3).trim() || 'typescript';
        currentCodeBlock = {
          language,
          code: '',
          title: '', // Will be set from previous context
        };
      } else {
        // End of code block
        isInCodeBlock = false;
        if (currentSection && currentCodeBlock) {
          currentSection.codeBlocks.push(currentCodeBlock);
          currentCodeBlock = null;
        }
      }
      continue;
    }

    if (isInCodeBlock) {
      currentCodeBlock.code += line + '\n';
      continue;
    }

    // Parse title (H1)
    if (line.startsWith('# ') && !title) {
      title = line.slice(2).trim();
      continue;
    }

    // Parse sections (H2)
    if (line.startsWith('## ')) {
      descriptionComplete = true;
      const sectionTitle = line.slice(3).trim();
      currentSection = {
        title: sectionTitle,
        content: [],
        codeBlocks: [],
      };
      sections.push(currentSection);
      continue;
    }

    // Parse subsections (H3)
    if (line.startsWith('### ') && currentSection) {
      const subsectionTitle = line.slice(4).trim();
      // Store subsection title - it will be used for the next code block
      currentSection.content.push({
        type: 'subsection',
        title: subsectionTitle,
      });
      continue;
    }

    // Parse description (first paragraph after title)
    if (!descriptionComplete && line.trim() && !title) {
      continue; // Skip until we have a title
    }

    if (!descriptionComplete && line.trim() && title && !description) {
      description = line.trim();
      // Continue reading description until empty line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() && !lines[j].startsWith('#')) {
        description += ' ' + lines[j].trim();
        i = j;
        j++;
      }
      continue;
    }

    // Add content to current section
    if (currentSection && line.trim()) {
      currentSection.content.push({ type: 'text', value: line.trim() });
    }
  }

  return { title, description, sections };
}

/**
 * Find the corresponding source file for a doc markdown file
 */
function findSourceFile(docFilePath) {
  const dir = path.dirname(docFilePath);
  const baseName = path.basename(docFilePath, '.doc.md');

  // Try common patterns
  const patterns = [
    `${baseName}.composable.ts`,
    `${baseName}.effect.ts`,
    `${baseName}.ts`,
  ];

  for (const pattern of patterns) {
    const sourcePath = path.join(dir, pattern);
    if (fs.existsSync(sourcePath)) {
      return sourcePath;
    }
  }

  return null;
}

/**
 * Read source code from file
 */
function readSourceCode(sourceFilePath) {
  if (!sourceFilePath || !fs.existsSync(sourceFilePath)) {
    return '// Source code not found';
  }

  return fs.readFileSync(sourceFilePath, 'utf-8');
}

/**
 * Determine category and subcategory from file path
 */
function getCategoryFromPath(filePath) {
  const relativePath = path.relative(LIB_PATH, filePath);
  const parts = relativePath.split(path.sep);

  let category = 'composables'; // default
  let subcategory = 'general';

  if (parts.includes('composables')) {
    category = 'composables';
    if (parts.includes('browser')) subcategory = 'browser';
    else if (parts.includes('activated-route')) subcategory = 'activated-route';
    else subcategory = 'general';
  } else if (parts.includes('effects')) {
    category = 'effects';
  } else if (parts.includes('utils')) {
    category = 'utils';
  }

  return { category, subcategory };
}

/**
 * Generate Angular component TypeScript code
 */
function generateComponent(
  parsed,
  sourceCode,
  componentName,
  category,
  subcategory,
) {
  const { title, description, sections } = parsed;

  // Escape strings for TypeScript
  const escapeString = (str) => str.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  // Generate template sections
  let templateSections = '';

  for (const section of sections) {
    const sectionTitle = escapeString(section.title);

    templateSections += `
      <documentation-section>
        <ng-container section-title>${sectionTitle}</ng-container>
`;

    // Extract subsection titles in order
    const subsectionTitles = section.content
      .filter((item) => item.type === 'subsection')
      .map((item) => item.title);

    // Add code blocks with corresponding subsection titles
    for (let i = 0; i < section.codeBlocks.length; i++) {
      const block = section.codeBlocks[i];
      const blockTitle =
        subsectionTitles[i] || `${section.title} Example ${i + 1}`;
      const varName = `code_${section.title.replace(/\s+/g, '_').toLowerCase()}_${i}`;

      templateSections += `
        <code-block title="${escapeString(blockTitle)}" [code]="${varName}" />
`;
    }

    templateSections += `      </documentation-section>
`;
  }

  // Generate code block variables
  let codeBlockVars = '';
  for (const section of sections) {
    for (let i = 0; i < section.codeBlocks.length; i++) {
      const block = section.codeBlocks[i];
      const varName = `code_${section.title.replace(/\s+/g, '_').toLowerCase()}_${i}`;
      const escapedCode = escapeString(block.code.trim());

      codeBlockVars += `  ${varName} = \`${escapedCode}\`;

`;
    }
  }

  // Generate source code variable
  const escapedSourceCode = escapeString(sourceCode);

  // Calculate relative path depth
  // All generated components are placed directly in their category/subcategory folder
  // e.g., pages/composables/use-debounced-signal-page.component.ts (2 levels from pages)
  // or pages/composables/activated-route/use-route-params-page.component.ts (3 levels from pages)
  // We need to go up to 'app/', which is one level above 'pages/'
  let levelsFromPages = 1; // Category level (composables, effects, etc.)
  if (subcategory && subcategory !== 'general') {
    levelsFromPages = 2; // Category + subcategory
  }
  const pathDepth = levelsFromPages + 1; // +1 to get from pages to app
  const relativePath = '../'.repeat(pathDepth);

  const componentCode = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '${relativePath}common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '${relativePath}common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '${relativePath}common/components/code-block/code-block.component';

@Component({
  selector: '${componentName}',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: \`
    <documentation>
      <ng-container documentation-title>${escapeString(title)}</ng-container>

      <ng-container documentation-description>
        ${escapeString(description)}
      </ng-container>
${templateSections}
      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="${escapeString(title)} Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${toPascalCase(componentName)}Component {
${codeBlockVars}  sourceCode = \`${escapedSourceCode}\`;
}
`;

  return componentCode;
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert function name to component name
 * e.g., useRouteParams -> use-route-params-page
 */
function toComponentName(functionName) {
  // Convert camelCase to kebab-case
  const kebab = functionName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  return `${kebab}-page`;
}

/**
 * Determine output path for generated component
 */
function getOutputPath(docFilePath, category, subcategory) {
  const fileName = path.basename(docFilePath, '.doc.md');
  const componentName = toComponentName(fileName);
  const componentFileName = `${componentName}.component.ts`;

  let outputDir = path.join(PAGES_PATH, category);

  if (subcategory && subcategory !== 'general') {
    outputDir = path.join(outputDir, subcategory);
  }

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return path.join(outputDir, componentFileName);
}

/**
 * Main compilation function
 */
function compileDocumentation() {
  console.log('📚 Compiling documentation...\n');

  const docFiles = findDocMarkdownFiles(LIB_PATH);

  if (docFiles.length === 0) {
    console.log('⚠️  No .doc.md files found');
    return;
  }

  console.log(`Found ${docFiles.length} documentation file(s):\n`);

  let compiled = 0;
  let errors = 0;

  for (const docFile of docFiles) {
    try {
      const relativePath = path.relative(process.cwd(), docFile);
      console.log(`  Compiling: ${relativePath}`);

      // Read and parse markdown
      const markdown = fs.readFileSync(docFile, 'utf-8');
      const parsed = parseMarkdown(markdown);

      // Find source file
      const sourceFile = findSourceFile(docFile);
      const sourceCode = readSourceCode(sourceFile);

      // Determine category
      const { category, subcategory } = getCategoryFromPath(docFile);

      // Generate component
      const fileName = path.basename(docFile, '.doc.md');
      const componentName = toComponentName(fileName);
      const componentCode = generateComponent(
        parsed,
        sourceCode,
        componentName,
        category,
        subcategory,
      );

      // Write component file
      const outputPath = getOutputPath(docFile, category, subcategory);
      fs.writeFileSync(outputPath, componentCode);

      const relativeOutput = path.relative(process.cwd(), outputPath);
      console.log(`    → ${relativeOutput}\n`);

      compiled++;
    } catch (error) {
      console.error(`    ✗ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log(
    `\n✅ Compilation complete: ${compiled} file(s) compiled, ${errors} error(s)\n`,
  );

  if (errors > 0) {
    process.exit(1);
  }
}

// Run compilation
compileDocumentation();
