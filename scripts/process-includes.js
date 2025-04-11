#!/usr/bin/env node

/**
 * Script to process {{#include}} directives in mdbook files
 * This script only processes {{#include}} directives and doesn't modify the book structure
 */

const fs = require('fs');
const path = require('path');
const { globby } = require('globby');

// Constants
const MDBOOK_DIRECTORY = path.join(process.cwd(), './mdbook/src');

/**
 * Process {{#include}} directives in a markdown file
 * @param {string} filePath - Path to the markdown file
 */
async function processIncludes(filePath) {
  try {
    console.log(`Processing includes in: ${filePath}`);
    
    // Read the file
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Match all {{#include ...}} directives
    const includeRegex = /\{\{#include\s+([^}]+?)(?::([^}]+))?\}\}/g;
    
    // Keep track of replacements
    const replacements = [];
    
    // Find all matches
    let match;
    while ((match = includeRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const includePath = match[1];
      const anchor = match[2];
      
      try {
        // Resolve the path relative to the original markdown file
        const originalDir = path.dirname(filePath);
        const includeFullPath = path.resolve(originalDir, includePath);
        
        if (fs.existsSync(includeFullPath)) {
          // Read the included file
          const includeContent = await fs.promises.readFile(includeFullPath, 'utf8');
          
          // Extract the relevant snippet based on the anchor (if provided)
          let snippet = includeContent;
          if (anchor) {
            // Try to find ANCHOR: comments
            const anchorStartRegex = new RegExp(`(?:\/\/|#)\\s*ANCHOR:\\s*${anchor}\\b`);
            const anchorEndRegex = new RegExp(`(?:\/\/|#)\\s*ANCHOR_END:\\s*${anchor}\\b`);
            
            const startMatch = anchorStartRegex.exec(includeContent);
            const endMatch = anchorEndRegex.exec(includeContent);
            
            if (startMatch && endMatch && startMatch.index < endMatch.index) {
              const startIndex = includeContent.indexOf('\n', startMatch.index) + 1;
              const endIndex = endMatch.index;
              snippet = includeContent.substring(startIndex, endIndex).trim();
            } else {
              console.warn(`Warning: Anchor '${anchor}' not found or invalid in ${includeFullPath}`);
            }
          }
          
          // Determine the language based on file extension
          const ext = path.extname(includeFullPath).toLowerCase();
          const lang = ext === '.rs' ? 'rust' : 
                      ext === '.ts' ? 'typescript' :
                      ext === '.js' ? 'javascript' :
                      ext === '.py' ? 'python' :
                      ext === '.sh' ? 'bash' :
                      ext === '.md' ? 'markdown' :
                      'text';
          
          // Create a markdown code block with the snippet
          const replacementCodeBlock = "```" + lang + "\n" + snippet + "\n```";
          
          // Add to replacements
          replacements.push({ 
            fullMatch, 
            replacement: replacementCodeBlock 
          });
        } else {
          console.warn(`Warning: Include file not found: ${includeFullPath}`);
        }
      } catch (includeError) {
        console.error(`Error processing include in ${filePath}:`, includeError);
      }
    }
    
    // Apply all replacements
    let processedContent = content;
    for (const replacement of replacements) {
      processedContent = processedContent.replace(replacement.fullMatch, replacement.replacement);
    }
    
    // Write the processed content back to the file
    if (content !== processedContent) {
      await fs.promises.writeFile(filePath, processedContent);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

/**
 * Find and process all markdown files in the mdbook directory
 */
async function processAllFiles() {
  try {
    // Find all markdown files
    const files = await globby([`${MDBOOK_DIRECTORY}/**/*.md`]);
    
    console.log(`Found ${files.length} markdown files to process.`);
    
    // Process each file
    const promises = files.map(file => processIncludes(file));
    await Promise.all(promises);
    
    console.log('All files processed successfully!');
  } catch (error) {
    console.error('Error processing files:', error);
    process.exit(1);
  }
}

// Run the script
processAllFiles(); 