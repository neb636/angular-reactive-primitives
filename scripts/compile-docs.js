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
  '../projects/documentation-site/src/app/compiled-pages',
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
 * Parse markdown table into rows and columns
 */
function parseTable(lines, startIndex) {
  const tableLines = [];
  let i = startIndex;
  
  // Read header row
  if (i >= lines.length || !lines[i].includes('|')) {
    return { table: null, nextIndex: startIndex };
  }
  
  const headerCells = lines[i]
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
  
  if (headerCells.length === 0) {
    return { table: null, nextIndex: startIndex };
  }
  
  tableLines.push(headerCells);
  i++;
  
  // Skip header separator (|---|---|)
  if (i < lines.length && lines[i].includes('|') && lines[i].includes('-')) {
    i++;
  }
  
  // Collect table rows
  while (i < lines.length && lines[i].includes('|') && !lines[i].match(/^\s*\|[\s-|:]+\|\s*$/)) {
    const cells = lines[i]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    if (cells.length > 0) {
      tableLines.push(cells);
    }
    i++;
  }
  
  if (tableLines.length === 0) {
    return { table: null, nextIndex: startIndex };
  }
  
  // First row is header
  const columns = tableLines[0];
  const rows = tableLines.slice(1);
  
  return { table: { columns, rows }, nextIndex: i };
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
        // Map html to html, ts to typescript
        const fileType = language === 'html' ? 'html' : language === 'ts' ? 'ts' : language;
        currentCodeBlock = {
          language: fileType === 'html' ? 'html' : fileType === 'ts' ? 'typescript' : language,
          fileType: fileType,
          code: '',
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
        table: null,
        returns: null,
      };
      sections.push(currentSection);
      continue;
    }

    // Parse subsections (H3)
    if (line.startsWith('### ') && currentSection) {
      const subsectionTitle = line.slice(4).trim();
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

    // Parse tables
    if (currentSection && line.includes('|') && line.trim().startsWith('|')) {
      const { table, nextIndex } = parseTable(lines, i);
      if (table) {
        currentSection.table = table;
        i = nextIndex - 1; // -1 because loop will increment
        continue;
      }
    }

    // Parse Returns section (special handling for inline code)
    // Capture all content until next section or empty line followed by section
    if (currentSection && currentSection.title === 'Returns' && line.trim()) {
      if (!currentSection.returns) {
        currentSection.returns = line.trim();
      } else {
        currentSection.returns += ' ' + line.trim();
      }
      continue;
    }

    // Parse bullet lists (lines starting with "- ")
    if (currentSection && line.trim().startsWith('- ')) {
      const listItems = [];
      let j = i;
      
      // Collect consecutive bullet items
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        const itemText = lines[j].trim().slice(2).trim(); // Remove "- " prefix
        listItems.push(itemText);
        j++;
      }
      
      // Add list as a single content item
      if (listItems.length > 0) {
        currentSection.content.push({ type: 'list', items: listItems });
        i = j - 1; // -1 because loop will increment
        continue;
      }
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
 * Get subcategories for a given category by scanning directories
 */
function getSubcategoriesForCategory(category) {
  const categoryPath = path.join(LIB_PATH, category);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
  const subcategories = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Check if this directory contains any .doc.md files (is a valid subcategory)
      const subcategoryPath = path.join(categoryPath, entry.name);
      const hasDocFiles = findDocMarkdownFiles(subcategoryPath).length > 0;
      
      if (hasDocFiles) {
        subcategories.push(entry.name);
      }
    }
  }

  return subcategories;
}

/**
 * Determine category and subcategory from file path
 */
function getCategoryFromPath(filePath) {
  const relativePath = path.relative(LIB_PATH, filePath);
  const parts = relativePath.split(path.sep);

  // Find the category (composables, effects, utils)
  let category = null;
  let categoryIndex = -1;
  
  for (let i = 0; i < parts.length; i++) {
    if (['composables', 'effects', 'utils'].includes(parts[i])) {
      category = parts[i];
      categoryIndex = i;
      break;
    }
  }

  // Default to composables if not found
  if (!category) {
    category = 'composables';
    return { category, subcategory: 'general' };
  }

  // Only composables have subcategories (browser, route, general, etc.)
  // Effects and utils don't have subcategories
  if (category !== 'composables') {
    return { category, subcategory: 'general' };
  }

  // Check if there's a subcategory (directory after composables)
  let subcategory = 'general';
  
  if (categoryIndex + 1 < parts.length) {
    const potentialSubcategory = parts[categoryIndex + 1];
    
    // Verify this is actually a subcategory directory by checking if it exists
    const categoryPath = path.join(LIB_PATH, category);
    const subcategoryPath = path.join(categoryPath, potentialSubcategory);
    
    if (fs.existsSync(subcategoryPath) && fs.statSync(subcategoryPath).isDirectory()) {
      // Check if this subcategory contains .doc.md files
      const hasDocFiles = findDocMarkdownFiles(subcategoryPath).length > 0;
      
      if (hasDocFiles) {
        subcategory = potentialSubcategory;
      }
    }
  }

  return { category, subcategory };
}

/**
 * Slugify text for use in IDs
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escape HTML entities for safe display in templates
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Convert markdown inline code to HTML
 */
function processInlineCode(text) {
  // Replace `code` with <code>code</code>
  return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * Convert markdown bold to HTML
 */
function processMarkdownBold(text) {
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Escape curly braces for Angular templates
 * Angular interprets { and } as ICU message syntax, so we need to escape them
 * Use {{ '{' }} and {{ '}' }} syntax for regular text
 * Use HTML entities &#123; and &#125; for curly braces inside <code> tags
 */
function escapeAngularCurlyBraces(text) {
  // Split by code tags to handle them separately
  const parts = text.split(/(<code>.*?<\/code>)/g);
  let result = '';
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('<code>') && parts[i].endsWith('</code>')) {
      // Use HTML entities for curly braces inside code tags
      const codeContent = parts[i];
      const escapedCode = codeContent.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
      result += escapedCode;
    } else {
      // Use Angular interpolation syntax for curly braces in regular text
      result += parts[i].replace(/{/g, "{{ '{' }}").replace(/}/g, "{{ '}' }}");
    }
  }
  
  return result;
}

/**
 * Process markdown formatting (code, bold, etc.)
 */
function processMarkdown(text) {
  let result = text;
  result = processMarkdownBold(result);
  result = processInlineCode(result);
  return result;
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

  // Escape strings for TypeScript template literals
  const escapeString = (str) => str.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  // Generate template sections
  let templateSections = '';
  let codeBlockVars = '';
  let tableVars = '';
  let codeBlockIndex = 1; // Start from 1 to match user's example
  let tableIndex = 0;
  const sectionData = []; // Collect section data for the sections array

  for (const section of sections) {
    const sectionTitle = escapeString(section.title);
    const sectionId = slugify(section.title);
    sectionData.push({ id: sectionId, title: section.title });

    templateSections += `
      <documentation-section id="${sectionId}">
        <ng-container section-title>${sectionTitle}</ng-container>
`;

    // Handle Usage section with code blocks
    if (section.title === 'Usage') {
      for (let i = 0; i < section.codeBlocks.length; i++) {
        const block = section.codeBlocks[i];
        const varName = `codeBlock${codeBlockIndex}`;
        const escapedCode = escapeString(block.code.trim());
        const fileType = block.fileType || 'ts';

        templateSections += `
        <code-block [code]="${varName}" [fileType]="'${fileType}'" />
`;

        codeBlockVars += `  ${varName} = \`${escapedCode}\`;
`;

        codeBlockIndex++;
      }
    }
    // Handle Parameters section with table
    else if (section.title === 'Parameters' && section.table) {
      const varName = `parametersTableRows`;
      const columnsVarName = `parametersTableColumns`;
      const { columns, rows } = section.table;

      // Process rows to handle markdown formatting
      const processedRows = rows.map(row => 
        row.map(cell => processMarkdown(escapeHtml(cell)))
      );
      const processedColumns = columns.map(col => processMarkdown(escapeHtml(col)));

      templateSections += `
        <simple-table [rows]="${varName}" [columns]="${columnsVarName}"></simple-table>
`;

      tableVars += `  ${varName} = ${JSON.stringify(processedRows)};
  ${columnsVarName} = ${JSON.stringify(processedColumns)};
`;
    }
    // Handle Returns section
    else if (section.title === 'Returns' && section.returns) {
      const processedReturns = escapeAngularCurlyBraces(processMarkdown(escapeHtml(section.returns)));
      templateSections += `
        <p>${processedReturns}</p>
`;
    }
    // Handle Debounce vs Throttle section with table
    else if (section.title === 'Debounce vs Throttle' && section.table) {
      const varName = `debounceVsThrottleRows`;
      const columnsVarName = `debounceVsThrottleColumns`;
      const { columns, rows } = section.table;

      // Process rows to handle markdown formatting
      const processedRows = rows.map(row => 
        row.map(cell => processMarkdown(escapeHtml(cell)))
      );
      const processedColumns = columns.map(col => processMarkdown(escapeHtml(col)));

      templateSections += `
        <simple-table [rows]="${varName}" [columns]="${columnsVarName}"></simple-table>
`;
      
      tableVars += `  ${varName} = ${JSON.stringify(processedRows)};
  ${columnsVarName} = ${JSON.stringify(processedColumns)};
`;
    }
    // Handle regular sections with text content (but not if they have code blocks - those are handled below)
    else if (section.content.length > 0 && section.codeBlocks.length === 0) {
      for (const contentItem of section.content) {
        if (contentItem.type === 'text') {
          const processedText = escapeAngularCurlyBraces(processMarkdown(escapeHtml(contentItem.value)));
          templateSections += `
        <p>${processedText}</p>
`;
        } else if (contentItem.type === 'list') {
          templateSections += `
        <ul>
`;
          for (const item of contentItem.items) {
            const processedItem = escapeAngularCurlyBraces(processMarkdown(escapeHtml(item)));
            templateSections += `
          <li>${processedItem}</li>
`;
          }
          templateSections += `
        </ul>
`;
        }
      }
    }
    // Handle other sections with code blocks
    else if (section.codeBlocks.length > 0) {
      for (let i = 0; i < section.codeBlocks.length; i++) {
        const block = section.codeBlocks[i];
        const varName = `codeBlock${codeBlockIndex}`;
        const escapedCode = escapeString(block.code.trim());
        const fileType = block.fileType || 'ts';

        templateSections += `
        <code-block [code]="${varName}" [fileType]="'${fileType}'" />
`;

        codeBlockVars += `  ${varName} = \`${escapedCode}\`;
`;

        codeBlockIndex++;
      }
    }

    templateSections += `      </documentation-section>
`;
  }

  // Generate source code variable
  const escapedSourceCode = escapeString(sourceCode);

  // Add Source section ID
  const sourceSectionId = slugify('Source');
  sectionData.push({ id: sourceSectionId, title: 'Source' });

  // Check if any sections have tables
  const hasTables = sections.some(section => section.table !== null);

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

  // Generate imports conditionally
  let simpleTableImport = '';
  let simpleTableImportItem = '';
  
  if (hasTables) {
    simpleTableImport = `import { SimpleTableComponent } from '${relativePath}common/components/simple-table/simple-table.component';
`;
    simpleTableImportItem = `    SimpleTableComponent,
`;
  }

  // Generate sections array as array of objects with id and title
  // Escape single quotes for TypeScript string literals
  const escapeSingleQuotes = (str) => str.replace(/'/g, "\\'");
  const sectionsArray = sectionData.map(s => {
    const escapedTitle = escapeSingleQuotes(s.title);
    return `  {\n    id: '${s.id}',\n    title: '${escapedTitle}',\n  }`;
  }).join(',\n');

  const componentCode = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '${relativePath}common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '${relativePath}common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '${relativePath}common/components/code-block/code-block.component';
import { OnThisPageComponent } from '${relativePath}common/components/on-this-page/on-this-page.component';
${simpleTableImport}@Component({
  selector: '${componentName}',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
    OnThisPageComponent,
${simpleTableImportItem}  ],
  template: \`
    <documentation>
      <ng-container documentation-title>${escapeString(title)}</ng-container>
      <p>${escapeAngularCurlyBraces(escapeHtml(description))}</p>
${templateSections}
      <documentation-section id="${sourceSectionId}">
        <ng-container section-title>Source</ng-container>
        <code-block [code]="sourceCode" [fileType]="'ts'" />
      </documentation-section>

      <ng-container sidebar-right>
        <on-this-page [sections]="sections" />
      </ng-container>
    </documentation>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${toPascalCase(componentName)}Component {
  sections = [
  ${sectionsArray}
  ];
${codeBlockVars}${tableVars}  sourceCode = \`${escapedSourceCode}\`;
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
