#!/usr/bin/env node

/**
 * Auto-generate and update the File Inventory section in MEMORY.md
 * Scans all .md files and updates the inventory with:
 * - File names
 * - Line counts
 * - File sizes
 * - Last modified date
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all markdown files (excluding MEMORY.md)
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.github', 'scripts'].includes(entry.name)) {
        files.push(...findMarkdownFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'MEMORY.md') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Count lines in a file
function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length - 1; // Subtract 1 for the last empty line
}

// Get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  return sizeKB;
}

// Get last modified date
function getLastModified(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString().split('T')[0];
}

// Generate markdown table
function generateInventoryTable(files) {
  if (files.length === 0) {
    return '| File | Lines | Size | Last Modified |\n| --- | --- | --- | --- |\n\n**Total**: 0 files, 0 lines, 0 KB';
  }
  
  const sortedFiles = files.sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
  
  let totalLines = 0;
  let totalSize = 0;
  
  const rows = sortedFiles.map(file => {
    const name = path.basename(file);
    const lines = countLines(file);
    const sizeKB = getFileSizeKB(file);
    const modified = getLastModified(file);
    
    totalLines += lines;
    totalSize += parseFloat(sizeKB);
    
    return `| ${name} | ${lines} | ${sizeKB} KB | ${modified} |`;
  });
  
  const header = '| File | Lines | Size | Last Modified |\n| --- | --- | --- | --- |';
  const summary = `\n**Total**: ${sortedFiles.length} files, ${totalLines} lines, ${totalSize.toFixed(1)} KB`;
  
  return header + '\n' + rows.join('\n') + summary;
}

// Update MEMORY.md with new inventory
function updateMemoryFile() {
  const cwd = process.cwd();
  const memoryPath = path.join(cwd, 'MEMORY.md');
  
  if (!fs.existsSync(memoryPath)) {
    console.error('❌ MEMORY.md not found');
    process.exit(1);
  }
  
  console.log('🔄 Scanning markdown files...');
  const mdFiles = findMarkdownFiles(cwd);
  console.log(`Found ${mdFiles.length} markdown files\n`);
  
  const inventoryTable = generateInventoryTable(mdFiles);
  
  // Read current MEMORY.md
  let memoryContent = fs.readFileSync(memoryPath, 'utf8');
  
  // Find and replace the inventory section
  const startMarker = '## File Inventory (Auto-generated)';
  const endMarker = '---';
  
  const startIndex = memoryContent.indexOf(startMarker);
  const endIndex = memoryContent.indexOf(endMarker, startIndex);
  
  if (startIndex === -1) {
    // Section doesn't exist, add it before the last ---
    const lastSeparatorIndex = memoryContent.lastIndexOf('---');
    if (lastSeparatorIndex !== -1) {
      const newSection = `\n## File Inventory (Auto-generated)\n\nLast updated: ${new Date().toISOString()}\n\n${inventoryTable}\n\n`;
      memoryContent = memoryContent.slice(0, lastSeparatorIndex) + newSection + memoryContent.slice(lastSeparatorIndex);
    }
  } else if (endIndex !== -1) {
    // Section exists, replace it
    const beforeSection = memoryContent.slice(0, startIndex);
    const afterSection = memoryContent.slice(endIndex);
    const newSection = `${startMarker}\n\nLast updated: ${new Date().toISOString()}\n\n${inventoryTable}\n\n`;
    memoryContent = beforeSection + newSection + afterSection;
  }
  
  // Write updated MEMORY.md
  fs.writeFileSync(memoryPath, memoryContent, 'utf8');
  
  console.log('✅ MEMORY.md updated with file inventory');
  console.log(`\n${inventoryTable}`);
}

// Run update
updateMemoryFile();
