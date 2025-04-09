#!/usr/bin/env node

/**
 * Script to generate a markdown book from the documentation submodules
 * Based on the action plan in action_plan.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import matter from 'gray-matter';
import { getDocs } from '../generate-links/getDocs.mjs';

// Constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIRECTORY = path.join(process.cwd());
const MDBOOK_DIR = path.join(process.cwd(), './mdbook');
const MDBOOK_SRC_DIR = path.join(MDBOOK_DIR, 'src');
const SUMMARY_PATH = path.join(MDBOOK_SRC_DIR, 'SUMMARY.md');
const README_PATH = path.join(MDBOOK_SRC_DIR, 'README.md');
const BOOK_TOML_PATH = path.join(MDBOOK_DIR, 'book.toml');

// --- START: Define Submodule Configuration ---
const SUBMODULE_CONFIG = {
  sway: {
    name: 'Sway Language',
    path: 'docs/sway/docs/book/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/sway/docs/book/src',
    patterns: ['docs/sway/docs/book/src/**/*.md', '!**/SUMMARY.md'],
  },
  'sway-libs': {
    name: 'Sway Libraries',
    path: 'docs/sway-libs/docs/book/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/sway-libs/docs/book/src',
    patterns: ['docs/sway-libs/docs/book/src/**/*.md', '!**/SUMMARY.md'],
  },
  'sway-standards': {
    name: 'Sway Standards',
    path: 'docs/sway-standards/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/sway-standards/docs/src',
    patterns: ['docs/sway-standards/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'sway-by-example-lib': {
    name: 'Sway by Example',
    path: 'docs/sway-by-example-lib/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/sway-by-example-lib/docs/src',
    patterns: ['docs/sway-by-example-lib/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'migrations-and-disclosures': {
    name: 'Migrations and Disclosures',
    path: 'docs/migrations-and-disclosures/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/migrations-and-disclosures/docs/src',
    patterns: [
      'docs/migrations-and-disclosures/docs/src/**/*.md',
      '!**/SUMMARY.md',
    ],
  },
  'verified-addresses': {
    name: 'Verified Addresses',
    path: 'docs/verified-addresses/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/verified-addresses/docs/src',
    patterns: ['docs/verified-addresses/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'fuel-token-overview': {
    name: 'Fuel Token Overview',
    path: 'docs/fuel-token-overview/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/fuel-token-overview/docs/src',
    patterns: ['docs/fuel-token-overview/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'fuel-book': {
    name: 'Fuel Book',
    path: 'docs/fuel-book/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/fuel-book/docs/src',
    patterns: ['docs/fuel-book/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'integration-docs': {
    name: 'Integration Docs',
    path: 'docs/integration-docs/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/integration-docs/docs/src',
    patterns: ['docs/integration-docs/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'node-operator': {
    name: 'Node Operator',
    path: 'docs/node-operator/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/node-operator/docs/src',
    patterns: ['docs/node-operator/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'fuels-rs': {
    name: 'Fuels-rs (Rust SDK)',
    path: 'docs/fuels-rs/docs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/fuels-rs/docs/src',
    patterns: ['docs/fuels-rs/docs/src/**/*.md', '!**/SUMMARY.md'],
  },
  'fuels-ts': {
    name: 'Fuels-ts (TypeScript SDK)',
    path: 'docs/fuels-ts/apps/docs/.vitepress/config.ts', // Path to config
    type: 'vitepress',
    sourceBaseDir: 'docs/fuels-ts/apps/docs/src', // Base dir for content files
    patterns: ['docs/fuels-ts/apps/docs/src/**/*.md'], // No need to exclude SUMMARY
  },
  specs: {
    name: 'Specs',
    path: 'docs/fuel-specs/src/SUMMARY.md',
    type: 'mdbook',
    sourceBaseDir: 'docs/fuel-specs/src',
    patterns: ['docs/fuel-specs/src/**/*.md', '!**/SUMMARY.md'],
  },
  guides: {
    name: 'Guides',
    path: null, // No single summary file
    type: 'none', // Treat as flat list unless structure is inferred
    sourceBaseDir: 'docs/guides/docs',
    patterns: ['docs/guides/docs/**/*.mdx'],
  },
  intro: {
    name: 'Introduction',
    path: null,
    type: 'none',
    sourceBaseDir: 'docs/intro',
    patterns: ['docs/intro/*.mdx'],
  },
  contributing: {
    name: 'Contributing',
    path: null,
    type: 'none',
    sourceBaseDir: 'docs/contributing',
    patterns: ['docs/contributing/*.mdx'],
  },
};
// --- END: Define Submodule Configuration ---

// Helper to get just the display names map
const SUBMODULE_NAMES = Object.fromEntries(
  Object.entries(SUBMODULE_CONFIG).map(([key, config]) => [key, config.name])
);

// Create output directory if it doesn't exist
if (!fs.existsSync(MDBOOK_DIR)) {
  fs.mkdirSync(MDBOOK_DIR, { recursive: true });
}

if (!fs.existsSync(MDBOOK_SRC_DIR)) {
  fs.mkdirSync(MDBOOK_SRC_DIR, { recursive: true });
}

/**
 * Finds all document paths for each submodule based on defined glob patterns using globby.
 * Uses SUBMODULE_CONFIG.
 * @returns {Promise<Object>} - A promise resolving to an object where keys are submodule names and values are arrays of doc paths.
 */
async function findAllDocuments() {
  const allDocs = {};
  for (const [submodule, config] of Object.entries(SUBMODULE_CONFIG)) {
    allDocs[submodule] = [];
    const patterns = config.patterns;
    if (!patterns || patterns.length === 0) {
      console.warn(`No path patterns defined for submodule ${submodule}`);
      continue;
    }
    // globby handles negation patterns directly in the array
    try {
      const files = await globby(patterns, {
        absolute: false,
        unique: true,
        nodir: true,
      });
      console.log(
        `Globby found ${files.length} files for patterns '${JSON.stringify(
          patterns
        )}' in submodule '${submodule}'`
      );
      // Add found files, ensuring paths use forward slashes
      allDocs[submodule].push(
        ...files.map((f) => path.normalize(f).split(path.sep).join('/'))
      );
    } catch (err) {
      console.error(
        `Error during globby execution for submodule ${submodule}:`,
        err
      );
    }
    // Deduplication is handled by globby with unique: true
    console.log(
      `Found ${allDocs[submodule].length} unique documents for submodule '${submodule}'`
    );
  }
  return allDocs;
}

/**
 * Parses a single SUMMARY.md file content into a hierarchical structure.
 * @param {string} content - The markdown content of the SUMMARY.md file.
 * @returns {Array} - An array of objects representing the structure.
 */
function parseSummaryStructure(content) {
  const lines = content.split('\n');
  const structure = [];
  const stack = [{ level: -1, items: structure }]; // Stack to manage nesting

  const linkRegex = /^\s*[-*]\s+\[(.*?)\]\((.*?)\)/;
  const headerRegex = /^\s*(#+)\s+(.*)/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Skip empty lines

    const indentLevel = line.search(/\S|$/) / 2; // Assuming 2 spaces per indent level

    // Adjust stack based on indentation
    while (indentLevel <= stack[stack.length - 1].level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    const linkMatch = line.match(linkRegex);
    const headerMatch = line.match(headerRegex);

    let newItem = null;
    if (linkMatch) {
      newItem = {
        type: 'link',
        title: linkMatch[1].trim(),
        link: linkMatch[2].trim(),
        level: indentLevel,
        items: [], // Placeholder for potential nested items
      };
    } else if (headerMatch) {
      newItem = {
        type: 'header',
        title: headerMatch[2].trim(),
        level: headerMatch[1].length, // Header level based on # count
        items: [], // Headers can conceptually contain nested items
      };
    } else if (trimmedLine.startsWith('#')) {
      // Handle headers without space after # (sometimes occurs)
      const level = trimmedLine.match(/^#+/)[0].length;
      const title = trimmedLine.replace(/^#+\s*/, '').trim();
      newItem = {
        type: 'header',
        title: title,
        level: level,
        items: [],
      };
    }

    if (newItem) {
      parent.items.push(newItem);
      stack.push({ level: indentLevel, items: newItem.items }); // Push new item onto stack for nesting
    }
  }

  return structure;
}

/**
 * Reads and parses SUMMARY.md files from specified submodule paths.
 * @returns {Promise<Array>} - A promise resolving to an array of objects, each containing submodule key, structure type, baseDir and parsed structure.
 */
async function parseSubmoduleSummaries() {
  const parsedSummaries = [];
  for (const [submodule, config] of Object.entries(SUBMODULE_CONFIG)) {
    if (config.path) {
      try {
        console.log(
          `Parsing submodule summary for ${submodule}: ${config.path} (Type: ${config.type})`
        );
        let content = ''; // Initialize content variable
        if (config.type !== 'vitepress') {
          // Read content only if not VitePress
          content = await fs.promises.readFile(config.path, 'utf8');
        }

        let structure = []; // Initialize structure as empty array

        if (config.type === 'mdbook') {
          structure = parseSummaryStructure(content);
        } else if (config.type === 'vitepress') {
          // *** START DEBUG LOGGING (Optional - keep for now) ***
          // Read the config file content for debugging purposes if needed
          const vitepressContentDebug = await fs.promises.readFile(
            config.path,
            'utf8'
          );
          console.log(
            `--- Debug: Content passed to parseVitePressConfig for ${submodule} (first 500 chars) ---`
          );
          console.log(vitepressContentDebug.substring(0, 500));
          console.log('--- End Debug ---');
          // *** END DEBUG LOGGING ***

          // Call the new parseVitePressConfig which uses import()
          structure = await parseVitePressConfig(config.path);
        }

        // Check if structure is not empty before pushing
        if (structure && structure.length > 0) {
          parsedSummaries.push({
            submodule: submodule,
            structure: { items: structure }, // Ensure structure matches expected format
          });
        } else {
          console.warn(
            `Parsed empty structure for ${submodule} from ${config.path}`
          );
        }
      } catch (error) {
        console.error(
          `Error parsing summary for ${submodule} at ${config.path}:`,
          error
        );
      }
    } else {
      console.log(`No SUMMARY.md defined or found for submodule: ${submodule}`);
    }
  }
  return parsedSummaries;
}

/**
 * Parse a SUMMARY.md file to extract its structure
 * @param {string} summaryPath - Path to the SUMMARY.md file
 * @param {string} submodule - The submodule this SUMMARY belongs to
 * @returns {Object} - Parsed structure of the SUMMARY.md
 */
function parseSummaryFile(summaryPath, submodule) {
  const absolutePath = path.join(process.cwd(), summaryPath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`No SUMMARY.md found at ${absolutePath} for ${submodule}`);
    return null;
  }

  try {
    console.log(`Parsing SUMMARY file: ${absolutePath}`);
    const content = fs.readFileSync(absolutePath, 'utf8');
    const lines = content.split('\n');

    // Root structure to return
    const structure = {
      title: SUBMODULE_NAMES[submodule] || submodule,
      items: [],
    };

    // Stack to track the current nesting level
    const stack = [structure];

    // Current indent level (number of spaces)
    let currentIndent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimEnd();

      // Skip empty lines
      if (!line.trim()) {
        continue;
      }

      // Skip comment lines
      if (line.trim().startsWith('<!--') && line.trim().endsWith('-->')) {
        continue;
      }

      // Handle headers (## Chapter Title)
      if (line.trim().startsWith('#')) {
        const match = line.trim().match(/^(#+)\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const title = match[2];

          // Headers at level 1 (#) are usually the book title
          // Headers at level 2 (##) are top-level categories
          if (level > 1) {
            const headerItem = {
              type: 'header',
              title: title,
              level: level,
            };
            structure.items.push(headerItem);
          }
        }
        continue;
      }

      // Handle list items (- [Title](link))
      const listMatch = line.match(/^(\s*)[-*+]\s+\[(.*?)\]\((.*?)\)(.*)$/);
      if (listMatch) {
        const indentSpaces = listMatch[1].length;
        const title = listMatch[2];
        let link = listMatch[3];
        const restOfLine = listMatch[4].trim();

        // Determine the indent level (0 = root)
        const indentLevel = Math.floor(indentSpaces / 2);

        // If indent changed, adjust the stack
        if (indentLevel > currentIndent) {
          // Going deeper in nesting
          const parent = stack[stack.length - 1];
          if (!parent.items) {
            parent.items = [];
          }
          stack.push(parent.items[parent.items.length - 1]);
        } else if (indentLevel < currentIndent) {
          // Going up in nesting
          for (let j = 0; j < currentIndent - indentLevel; j++) {
            stack.pop();
          }
        }

        // Special case: README.md or index.md files might be linked in SUMMARY.md
        // but should be mapped to the root of the submodule
        if (
          link === 'README.md' ||
          link === './README.md' ||
          link === 'index.md' ||
          link === './index.md'
        ) {
          link = './';
        }

        // Create the item
        const item = {
          type: 'link',
          title: title,
          link: link,
          indent: indentLevel,
        };

        // Handle nested items
        if (restOfLine) {
          item.items = [];
        }

        // Add to the current position in the stack
        const current = stack[stack.length - 1];
        if (!current.items) {
          current.items = [];
        }
        current.items.push(item);

        // Update the current indent
        currentIndent = indentLevel;
      }
    }

    return structure;
  } catch (error) {
    console.error(`Error parsing SUMMARY.md for ${submodule}:`, error);
    return null;
  }
}

/**
 * Convert MDX content to MD
 * This is a simple conversion that handles basic MDX features
 * @param {string} inputContent - MDX content to convert
 * @returns {string} - Converted MD content
 */
function convertMdxToMd(inputContent) {
  // Remove import statements
  let processedContent = inputContent.replace(
    /import\s+.*?from\s+(['"]).*?\1;?/g,
    ''
  );

  // Replace export default statements
  processedContent = processedContent.replace(/export\s+default\s+.*?;?/g, '');

  // Replace JSX components with markdown content when possible
  // This is a simplified version; complex components may need manual conversion
  processedContent = processedContent.replace(
    /<([A-Z][a-zA-Z0-9]*)(\s+.*?)?>.*?<\/\1>/g,
    (match, tag, attrs) => {
      // Simplistic conversion - in a real implementation, this would be more sophisticated
      return `<!-- ${tag} component here -->`;
    }
  );

  return processedContent;
}

/**
 * Process a document for inclusion in the mdbook
 * @param {string} docPath - Path to the document (relative to project root)
 * @param {string} submodule - The submodule key this document belongs to
 * @returns {Object | null} - Document info for SUMMARY.md generation, or null on error.
 */
async function processDocument(docPath, submodule) {
  try {
    // --- START: Calculate Output Path (Revised Logic) ---
    const config = SUBMODULE_CONFIG[submodule];
    if (!config || !config.sourceBaseDir) {
      console.error(
        `Error processing ${docPath}: Missing config or sourceBaseDir for submodule '${submodule}'.`
      );
      return null;
    }

    // 1. Get path relative to the submodule's defined source base directory
    const relativeToSourceBase = path.relative(config.sourceBaseDir, docPath);

    // 2. Construct the new path relative to mdbook/src
    //    Combine submodule key + path relative to its source base
    let newPath = path
      .join(submodule, relativeToSourceBase)
      .replace(/\\/g, '/'); // Ensure forward slashes

    // 3. Handle file extension (.mdx -> .md)
    newPath = newPath.replace(/\.mdx$/, '.md');

    // 4. Remove any potential leading slash if join added one unexpectedly
    if (newPath.startsWith('/')) {
      newPath = newPath.substring(1);
    }
    // --- END: Calculate Output Path (Revised Logic) ---

    // Read the document
    const content = await fs.promises.readFile(docPath, 'utf8');

    // Parse front matter if it exists
    const { data, content: documentContent } = matter(content);

    // Process cross-references - TODO: Implement cross-reference fixing here
    let processedContent = documentContent;

    // Convert MDX if needed (basic)
    if (docPath.endsWith('.mdx')) {
      processedContent = convertMdxToMd(processedContent);
    }

    // Process {{#include ...}} directives
    const includeRegex = /\{\{#include\s+([^}]+?)(?::([^}]+))?\}\}/g;
    const replacements = [];

    let match;
    while (true) {
      match = includeRegex.exec(processedContent);
      if (match === null) {
        break;
      }
      const fullMatch = match[0];
      const includePath = match[1];
      const anchor = match[2]; // Anchor handling might be needed later

      try {
        // Resolve the absolute path of the include file based on the *original* document
        const docDir = path.dirname(docPath);
        const includeFullPath = path.resolve(docDir, includePath.trim());

        // --- Restore original include logic --- START
        if (fs.existsSync(includeFullPath)) {
          // Read the included file content
          const snippet = await fs.promises.readFile(includeFullPath, 'utf8');

          // Determine language for syntax highlighting (simplified)
          const ext = path.extname(includeFullPath).toLowerCase();
          const lang =
            ext === '.sw'
              ? 'sway'
              : ext === '.rs'
                ? 'rust'
                : ext === '.ts'
                  ? 'typescript'
                  : ext === '.js'
                    ? 'javascript'
                    : ext === '.py'
                      ? 'python'
                      : ext === '.sh'
                        ? 'bash'
                        : ext === '.md'
                          ? 'markdown'
                          : 'text';

          // Create a markdown code block with the snippet
          // TODO: Add anchor processing if needed
          const replacementCodeBlock = `${snippet.trim()}`;

          // Use a temporary unique object to ensure correct replacement order later
          replacements.push({
            key: Symbol(),
            fullMatch: fullMatch,
            replacement: replacementCodeBlock,
          });
          console.log(`Included content from: ${includePath} in ${docPath}`);
        } else {
          console.warn(
            `Include file not found: ${includeFullPath} (referenced in ${docPath})`
          );
          // Replace with a warning comment if file not found
          const placeholderComment = `<!-- MDBOOK-INCLUDE-ERROR: File not found '${includePath.trim()}' -->`;
          replacements.push({
            key: Symbol(),
            fullMatch: fullMatch,
            replacement: placeholderComment,
          });
        }
        // --- Restore original include logic --- END

        /* --- TEMPORARY FIX: Comment out the include directive (Now Removed) --- START
        const placeholderComment = `<!-- MDBOOK-INCLUDE: ${includePath.trim()} -->`;
        replacements.push({
          key: Symbol(),
          fullMatch: fullMatch,
          replacement: placeholderComment,
        });
        console.log(
          `Temporarily commenting out include: ${includePath} in ${docPath}`
        );
        --- TEMPORARY FIX: Comment out the include directive (Now Removed) --- END */
      } catch (includeError) {
        console.error(
          `Error processing include directive ${fullMatch} in ${docPath}:`,
          includeError
        );
        // Create placeholder even on error to avoid mdbook failure
        const placeholderComment = `<!-- MDBOOK-INCLUDE-ERROR: Processing error for '${includePath.trim()}' -->`;
        replacements.push({
          key: Symbol(),
          fullMatch: fullMatch,
          replacement: placeholderComment,
        });
      }
    }

    // Apply all replacements in a single pass (to avoid overlap issues)
    for (const replacement of replacements) {
      processedContent = processedContent.replace(
        replacement.fullMatch,
        replacement.replacement
      );
    }

    // Extract title, category, order
    const extractedTitle =
      data.title ||
      path.basename(docPath, path.extname(docPath)).replace(/[-_]/g, ' ');
    const extractedCategory = data.category || submodule;
    const extractedOrder = data.order || 999;

    // Return the collected data - file writing and cross-ref processing happen later
    return {
      originalPath: docPath, // Original path relative to project root
      path: newPath, // The relative path within mdbook/src
      content: processedContent, // Content *before* cross-reference processing
      title: extractedTitle,
      category: extractedCategory,
      order: extractedOrder,
      submoduleKey: submodule, // Added the submodule key here
    };
  } catch (error) {
    console.error(`Error during initial processing of ${docPath}:`, error);
    // Return null or throw, depending on desired error handling for the main loop
    return null;
  }
}

/**
 * Generate a SUMMARY.md file for the mdbook using original SUMMARY.md structures
 * @param {Object} categoryMap - Map of categories to document entries
 * @param {Array} parsedSummaries - Array of parsed SUMMARY.md structures
 * @param {Map} linkMap - Map of original paths to new paths
 * @param {string} baseDir - Base directory of the original docs (for resolving paths)
 */
function generateSummary(categoryMap, parsedSummaries, linkMap, baseDir) {
  let summaryContent = '';
  summaryContent += '[Introduction](README.md)\n\n';

  // Process each submodule
  for (const [submoduleKey, submoduleName] of Object.entries(SUBMODULE_NAMES)) {
    const submoduleSummary = parsedSummaries.find(
      (s) => s && s.submodule === submoduleKey
    );
    const documents = categoryMap[submoduleKey] || [];

    if (documents.length === 0) {
      console.log(
        `Skipping submodule ${submoduleKey} because it has no documents`
      );
      continue; // Skip if no documents in this category
    }

    summaryContent += `# ${submoduleName}\n\n`;

    if (submoduleSummary?.structure) {
      // Use the structure from the original SUMMARY.md
      summaryContent += generateStructuredSummary(
        submoduleSummary.structure.items,
        submoduleKey,
        linkMap,
        documents,
        baseDir
      );
    } else {
      // Fall back to a flat list sorted by title
      documents.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });

      for (const doc of documents) {
        summaryContent += `- [${doc.title}](${doc.path})\n`;
      }
    }

    summaryContent += '\n';
  }

  console.log(`Writing SUMMARY.md to ${SUMMARY_PATH}...`);
  fs.writeFileSync(SUMMARY_PATH, summaryContent);
  console.log(`Generated SUMMARY.md at ${SUMMARY_PATH}`);
}

/**
 * Generate structured SUMMARY content based on original structure
 * @param {Array} items - Items from the parsed SUMMARY.md
 * @param {string} submodule - Submodule key
 * @param {Map} linkMap - Map of original paths to new paths
 * @param {Array} documents - Processed documents for this submodule
 * @param {string} baseDir - Base directory for resolving paths
 * @param {number} level - Current nesting level (for indentation)
 * @returns {string} - Generated SUMMARY content
 */
function generateStructuredSummary(
  items,
  submodule,
  linkMap,
  documents,
  baseDir,
  level = 0
) {
  if (!items || items.length === 0) {
    return '';
  }

  let content = '';
  const indent = '  '.repeat(level); // Indentation based on recursion level

  // Get the directory of the original SUMMARY.md or config file for this submodule
  const summaryPath = SUBMODULE_CONFIG[submodule]?.path;
  const summaryDir = summaryPath ? path.dirname(summaryPath) : '';

  for (const item of items) {
    if (item.type === 'header') {
      // Use the title and level from the parsed structure
      const headerLevel = '#'.repeat(Math.max(1, item.level || 1)); // Add default level if undefined
      content += `${indent}${headerLevel} ${item.title}\n\n`;
    } else if (item.type === 'link') {
      const originalLink = item.link;
      let newPath = '';

      // Skip placeholder/anchor links
      if (originalLink === '#' || originalLink.startsWith('#')) {
        newPath = originalLink; // Keep anchor links as is
        console.log(
          `${indent}- Keeping anchor link: [${item.title}](${newPath})`
        );
      } else {
        let lookupKey = ''; // Initialize lookupKey
        const submoduleConfig = SUBMODULE_CONFIG[submodule]; // Get submodule config

        try {
          // *** START: Modified Lookup Key Generation ***
          if (
            submoduleConfig?.type === 'vitepress' &&
            submoduleConfig?.sourceBaseDir
          ) {
            // For VitePress, resolve the link relative to its sourceBaseDir
            lookupKey = path.join(submoduleConfig.sourceBaseDir, originalLink);
            // Normalize the lookup key exactly like the map keys
            lookupKey = lookupKey.split(path.sep).join('/');
            lookupKey = lookupKey.startsWith('./')
              ? lookupKey.substring(2)
              : lookupKey;
            console.log(
              `${indent}- Trying lookup (VitePress): [${item.title}] (Original Link: ${originalLink}, SourceBase: ${submoduleConfig.sourceBaseDir}, Lookup Key: ${lookupKey})`
            );
          } else if (summaryDir) {
            // For mdbook (default), resolve relative to the SUMMARY.md directory
            const resolvedOriginalPath = path.resolve(summaryDir, originalLink);
            const pathFromProjectRoot = path.relative(
              process.cwd(),
              resolvedOriginalPath
            );
            // Normalize the lookup key exactly like the map keys
            lookupKey = pathFromProjectRoot.split(path.sep).join('/');
            lookupKey = lookupKey.startsWith('./')
              ? lookupKey.substring(2)
              : lookupKey;
            console.log(
              `${indent}- Trying lookup (mdBook): [${item.title}] (Original Link: ${originalLink}, SummaryDir: ${summaryDir}, Lookup Key: ${lookupKey})`
            );
          } else {
            // Handle case where resolution is not possible (e.g., missing summaryDir for mdbook type)
            console.warn(
              `${indent}- Cannot resolve link '${originalLink}' for submodule ${submodule} without a known SUMMARY.md path or VitePress config.`
            );
            newPath = `#link-error-unresolvable-${originalLink.replace(
              /[^a-zA-Z0-9]/g,
              '-'
            )}`;
          }
          // *** END: Modified Lookup Key Generation ***

          // Perform lookup only if a valid newPath wasn't already assigned (due to resolution error above)
          if (newPath === '') {
            // Look up the generated lookupKey in our global linkMap
            newPath = linkMap.get(lookupKey);

            // Try variations if direct lookup fails (like adding .md or index.md)
            if (!newPath) {
              console.log(
                `${indent}  -> Direct map lookup failed for key: ${lookupKey}`
              );
              const keyWithoutExt = lookupKey.replace(/\.mdx?$/, '');
              const variations = [
                // Try common index/readme variations first
                `${keyWithoutExt}/index.md`,
                `${keyWithoutExt}/README.md`,
                `${lookupKey}.md`,
                lookupKey.replace(/\/$/, '/index.md'), // Handle dir links like guide/contracts/
                lookupKey.replace(/\/$/, '/README.md'),
                keyWithoutExt, // Try key without any extension
              ];
              for (const variation of variations) {
                if (linkMap.has(variation)) {
                  newPath = linkMap.get(variation);
                  console.log(
                    `${indent}    -> Found with variation: ${variation} -> ${newPath}`
                  );
                  break;
                }
              }
            }

            if (!newPath) {
              console.warn(
                `${indent}  -> Link mapping failed for '${originalLink}' (Lookup Key: ${lookupKey}). Inserting placeholder.`
              );
              // Use a placeholder anchor instead of the wrong original link
              newPath = `#link-error-missing-${lookupKey.replace(
                /[^a-zA-Z0-9]/g,
                '-'
              )}`;
            }
          }
        } catch (resolveError) {
          console.error(
            `${indent}  Error resolving/mapping link '${originalLink}' in ${submodule}:`,
            resolveError
          );
          newPath = `#link-error-unresolvable-${originalLink.replace(
            /[^a-zA-Z0-9]/g,
            '-'
          )}`; // Placeholder
        }
      }

      // Append the list item
      // Use a bullet point appropriate for the level (mdbook uses alternating - and *)
      const bullet = level % 2 === 0 ? '-' : '*';
      // Add a comment only if we inserted a placeholder link
      const linkIssueComment = newPath.startsWith('#link-error')
        ? ' <!-- Link Resolution Issue -->'
        : '';
      content += `${indent}${bullet} [${item.title}](${newPath})${linkIssueComment}\n`;
    }

    // Process nested items recursively
    if (item.items && item.items.length > 0) {
      content += generateStructuredSummary(
        item.items,
        submodule,
        linkMap,
        documents,
        baseDir,
        level + 1
      );
    }
  }

  return content;
}

/**
 * Generate a README.md file for the mdbook
 */
function generateReadme() {
  const includedReposList = Array.from(
    Object.entries(SUBMODULE_NAMES).map(([key, name]) => `- ${name}`)
  ).join('\n');
  const readmeContent = `# Fuel Docs Hub

This mdbook contains documentation from multiple repositories in the Fuel ecosystem.

## Included Repositories

${includedReposList}
`;

  console.log(`Writing README.md to ${README_PATH}...`);
  fs.writeFileSync(README_PATH, readmeContent);
  console.log(`Generated README.md at ${README_PATH}`);
}

/**
 * Generate book.toml configuration file for mdbook
 */
function generateBookToml() {
  const bookTomlContent = `[book]
authors = ["Fuel Labs"]
language = "en"
multilingual = false
src = "src"
title = "Fuel Docs Hub"

[output.html]
default-theme = "fuel-dark"
preferred-dark-theme = "fuel-dark"

[output.html.search]
limit-results = 30
use-boolean-and = true
boost-title = 2
boost-hierarchy = 1
boost-paragraph = 1
expand = true
heading-split-level = 3
`;

  console.log(`Writing book.toml to ${BOOK_TOML_PATH}...`);
  fs.writeFileSync(BOOK_TOML_PATH, bookTomlContent);
  console.log(`Generated book.toml at ${BOOK_TOML_PATH}`);
}

/**
 * Main function to generate the mdbook
 */
async function generateMdBook() {
  try {
    console.log('Starting mdbook generation...');

    // 1. Find all documents based on patterns
    const allDocs = await findAllDocuments();
    console.log(
      `Found ${Object.values(allDocs).flat().length} documents total.`
    );

    // Create a map to store original path -> new path for link resolution
    const linkMap = new Map();

    // 2. Process each document: copy, convert, extract front matter
    const processingPromises = [];
    for (const [submodule, docPaths] of Object.entries(allDocs)) {
      console.log(`Queueing ${docPaths.length} documents for ${submodule}...`);
      for (const docPath of docPaths) {
        // Call processDocument - outputPath will be determined inside
        // Pass docPath, submodule, and linkMap (which is empty initially)
        processingPromises.push(processDocument(docPath, submodule));
      }
    }
    const processedDocsResults = await Promise.all(processingPromises);

    // Filter out null results (errors) and categorize valid results
    // NOW is the time to populate the linkMap
    const categoryMap = {};
    processedDocsResults.forEach((processed) => {
      if (processed) {
        // Populate linkMap HERE
        if (processed.originalPath && processed.path) {
          // Normalize the key before setting: forward slashes, remove leading './'
          let key = processed.originalPath.split(path.sep).join('/');
          key = key.startsWith('./') ? key.substring(2) : key;
          linkMap.set(key, processed.path); // Use normalized key
          console.log(
            // Add logging for map entries
            `  Setting linkMap: [${key}] -> [${processed.path}]`
          );
        } else {
          console.warn(
            `Skipping linkMap entry for ${
              processed.originalPath || 'unknown'
            }: Missing originalPath or processed path.`
          );
        }

        const submoduleKey = processed.submoduleKey;

        if (!submoduleKey || !SUBMODULE_NAMES[submoduleKey]) {
          console.warn(
            `Warning: Processed document ${processed.originalPath} has invalid or missing submoduleKey: '${submoduleKey}'. Skipping categorization.`
          );
          return;
        }

        console.log(
          `Categorizing ${processed.originalPath} as submodule: ${submoduleKey}`
        );

        if (!categoryMap[submoduleKey]) {
          categoryMap[submoduleKey] = [];
        }
        categoryMap[submoduleKey].push(processed);
        // linkMap.set(processed.originalPath, processed.path); // Moved population earlier
      }
    });

    // *** ADDED: Write processed documents to disk ***
    console.log(
      `Writing ${
        processedDocsResults.filter(Boolean).length
      } processed documents to mdbook/src...`
    );
    for (const processed of processedDocsResults) {
      if (processed?.path && processed?.content !== undefined) {
        const outputPath = path.join(MDBOOK_SRC_DIR, processed.path);
        try {
          // Ensure the output directory exists
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          // Write the processed content to the file
          fs.writeFileSync(outputPath, processed.content);
          // console.log(`  -> Wrote ${processed.path}`); // Optional: Verbose logging
        } catch (writeError) {
          console.error(`Error writing file ${outputPath}:`, writeError);
        }
      } else if (processed) {
        console.warn(
          `Skipping write for ${
            processed?.originalPath || 'unknown document'
          } due to missing path or content.`
        );
      }
    }
    console.log('Finished writing documents.');

    // 3. Parse Submodule Summaries
    const parsedSummaries = await parseSubmoduleSummaries();
    console.log(
      `Parsed ${
        parsedSummaries.filter((s) => s.structure).length
      } submodule structure files.`
    );

    // 4. Generate final files (SUMMARY.md, README.md, book.toml)
    generateSummary(categoryMap, parsedSummaries, linkMap, DOCS_DIRECTORY);
    generateReadme();
    generateBookToml();

    console.log('Finished generating mdbook!');
  } catch (error) {
    console.error('Error generating mdbook:', error);
    process.exit(1);
  }
}

/**
 * Parses VitePress config file content to extract the sidebar structure.
 * Uses a recursive approach to handle nested items.
 * @param {string} configPath - The path to the VitePress config file.
 * @returns {Promise<Array>} - A promise resolving to an array of objects representing the structure.
 */
async function parseVitePressConfig(configPath) {
  console.log(`Parsing VitePress config via dynamic import: ${configPath}`);
  try {
    // Convert config path to file URL for dynamic import
    const fileUrl = path.toNamespacedPath(path.resolve(configPath));
    // On Windows, dynamic import needs file:/// prefix explicitly
    const importPath =
      process.platform === 'win32'
        ? `file:///${fileUrl.replace(/\\/g, '/')}`
        : fileUrl;

    console.log(`--- Debug: Attempting dynamic import from: ${importPath} ---`);
    const module = await import(importPath);
    console.log('--- Debug: Dynamic import successful. ---');

    if (!module.default?.themeConfig?.sidebar) {
      console.warn(
        `Could not find 'themeConfig.sidebar' in default export of ${configPath}`
      );
      return [];
    }

    const sidebar = module.default.themeConfig.sidebar;
    if (!Array.isArray(sidebar)) {
      console.warn(
        `Expected 'themeConfig.sidebar' to be an array in ${configPath}, but got type: ${typeof sidebar}`
      );
      return [];
    }
    console.log(
      `--- Debug: Found sidebar structure with ${sidebar.length} top-level elements. ---`
    );

    // Recursive function to transform VitePress sidebar items to mdbook structure
    function transformVitePressItems(items) {
      if (!Array.isArray(items)) return [];
      const result = [];
      for (const item of items) {
        if (!item || typeof item !== 'object') continue;

        // Handle nested sections like { items: [ ... ] } which are common grouping wrappers
        if (item.items && !item.text && !item.link) {
          result.push(...transformVitePressItems(item.items));
          continue;
        }

        if (!item.text) {
          continue; // Skip items without text
        }

        let title = item.text;
        let link = '#'; // Default for items without a link (like categories)

        if (item.link) {
          // Clean up the link: remove leading slash, ensure .md or index.md
          link = item.link.startsWith('/') ? item.link.substring(1) : item.link;
          const hasTrailingSlash = link.endsWith('/');
          const baseSourceDir = SUBMODULE_CONFIG['fuels-ts']?.sourceBaseDir; // Get base dir safely

          // Only add .md if it's not an external link and doesn't already have an extension
          if (
            link &&
            !link.startsWith('http') &&
            !link.startsWith('#') &&
            !path.extname(link)
          ) {
            // Check if baseSourceDir exists, needed for context potentially
            if (!baseSourceDir) {
              console.warn(
                '--- Debug: Cannot resolve link path properly, fuels-ts sourceBaseDir not found in config ---'
              );
            }
            // Determine suffix based on original trailing slash
            if (hasTrailingSlash) {
              link = path.join(link, 'index.md').replace(/\\/g, '/');
            } else {
              // Default to adding .md for files without extensions
              link += '.md';
            }
          } else if (hasTrailingSlash) {
            // If it originally had a trailing slash (and an extension, e.g., '/api/'), assume index.md
            link = path.join(link, 'index.md').replace(/\\/g, '/');
          }
          link = link.split(path.sep).join('/'); // Ensure forward slashes
        } else if (!item.items || item.items.length === 0) {
          // Optional: Skip items that have no link AND no sub-items
          // console.log(`--- Debug: Skipping item without link or sub-items: ${title} ---`);
          // continue;
        }

        const newItem = {
          type: 'link', // Treat everything as a link initially for mdbook structure
          title: title,
          link: link, // Use the processed link
          items: item.items ? transformVitePressItems(item.items) : [],
        };
        result.push(newItem);
      }
      return result;
    }

    const transformedStructure = transformVitePressItems(sidebar);
    console.log(
      `--- Debug: Transformed structure has ${transformedStructure.length} top-level items. ---`
    );
    // console.log("--- Debug: Transformed Structure Sample:", JSON.stringify(transformedStructure, null, 2).substring(0, 1000)); // Log sample if needed

    return transformedStructure; // Return structure on success
  } catch (error) {
    console.error(
      `Error dynamically importing or processing VitePress config ${configPath}:`,
      error
    );
    return []; // Return empty array on error
  }
}

/**
 * Parses the structure definition (SUMMARY.md or config.ts) for each relevant submodule.
 */

// Execute the main function (ensure this is outside any function definition)
generateMdBook().catch((error) => {
  console.error('Error generating mdbook:', error);
  process.exit(1);
});
