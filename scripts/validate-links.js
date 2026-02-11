#!/usr/bin/env node

/**
 * Validate all internal markdown links in the repository
 * Checks that all [text](file.md) references point to existing files
 * Exit code: 0 = success, 1 = broken links found
 */

const fs = require('fs');
const path = require('path');

// Find all markdown files
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // Skip hidden files
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively search subdirectories (except node_modules, .git)
      if (!['node_modules', '.git', '.github'].includes(entry.name)) {
        files.push(...findMarkdownFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract markdown links from content
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[2]); // Capture the URL/file path
  }
  
  return links;
}

// Main validation function
function validateLinks() {
  const cwd = process.cwd();
  console.log(`🔍 Validating links in: ${cwd}\n`);
  
  const mdFiles = findMarkdownFiles(cwd);
  console.log(`Found ${mdFiles.length} markdown files\n`);
  
  const brokenLinks = [];
  
  for (const mdFile of mdFiles) {
    try {
      const content = fs.readFileSync(mdFile, 'utf8');
      const links = extractLinks(content);
      
      if (links.length === 0) continue;
      
      const fileDir = path.dirname(mdFile);
      const relativeFile = path.relative(cwd, mdFile);
      
      for (const link of links) {
        // Skip external links (http://, https://, etc.)
        if (link.match(/^https?:\/\//i) || link.match(/^#/)) {
          continue;
        }
        
        // Resolve the link path
        const targetPath = path.resolve(fileDir, link);
        
        // Check if file exists
        if (!fs.existsSync(targetPath)) {
          brokenLinks.push({
            file: relativeFile,
            link,
            targetPath: path.relative(cwd, targetPath)
          });
        }
      }
    } catch (error) {
      console.error(`Error reading ${mdFile}:`, error.message);
    }
  }
  
  if (brokenLinks.length > 0) {
    console.error('❌ Broken links found:\n');
    for (const { file, link, targetPath } of brokenLinks) {
      console.error(`  ${file}`);
      console.error(`    → [${link}] (resolved to: ${targetPath})`);
    }
    console.error(`\nTotal broken links: ${brokenLinks.length}`);
    process.exit(1);
  }
  
  console.log(`✅ All ${mdFiles.length} files have valid links`);
  process.exit(0);
}

// Run validation
validateLinks();
