#!/usr/bin/env node

/**
 * Simple test script to verify the documentation system is working.
 * This checks that .doc.ts files exist and are properly structured.
 */

const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, 'projects/angular-reactive-primitives/src/lib');

function findDocFiles(dir) {
  const files = [];

  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.doc.ts')) {
        files.push(fullPath);
      }
    }
  }

  scan(dir);
  return files;
}

console.log('🔍 Searching for .doc.ts files...\n');

const docFiles = findDocFiles(libPath);

if (docFiles.length === 0) {
  console.log('❌ No .doc.ts files found!');
  process.exit(1);
}

console.log(`✅ Found ${docFiles.length} documentation file(s):\n`);

docFiles.forEach((file, index) => {
  const relativePath = path.relative(__dirname, file);
  console.log(`${index + 1}. ${relativePath}`);

  // Quick validation - check if file contains required exports
  const content = fs.readFileSync(file, 'utf-8');
  const hasMetadata = content.includes('export const metadata');
  const hasSourceCode = content.includes('export const sourceCode');
  const hasExampleCode = content.includes('export const exampleCode');
  const hasDocEntry = content.includes('export const docEntry');

  const checks = [];
  if (hasMetadata) checks.push('metadata');
  if (hasSourceCode) checks.push('sourceCode');
  if (hasExampleCode) checks.push('exampleCode');
  if (hasDocEntry) checks.push('docEntry');

  console.log(`   Exports: ${checks.join(', ')}`);

  if (checks.length < 4) {
    console.log('   ⚠️  Missing required exports!');
  }
});

console.log('\n✅ Documentation system verification complete!');
console.log('\nNext steps:');
console.log('  1. Run: npm run docs:dev');
console.log('  2. Visit: http://localhost:4200');
console.log('  3. Navigate to documentation pages to verify rendering\n');
