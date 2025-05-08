import fsSync from 'fs'; // Need sync version for recursive calls
import path from 'path';
import fs from 'fs/promises';

const sourceDir = path.resolve('.contentlayer/generated/MdDoc');
const outputBaseDir = path.resolve('extract-md-files'); // Output directory
const filePrefix = 'docs__';
const fileSuffix = '.json';

// Regex patterns for import directives
const codeImportRegex = /<CodeImport[^>]*>/g;
const includeRegex = /{{#include\s+([^}]+)}}/g;

// --- Helper Functions ---

/**
 * Resolves the absolute path of an imported file relative to the source markdown file.
 * @param {string} sourceFileDir - The directory of the source markdown file (e.g., 'docs/fuel-book/src/intro').
 * @param {string} importPath - The raw path from the import directive (e.g., '../../my-project/src/code.rs:my_anchor').
 * @returns { { absPath: string, anchor: string | null } } - Absolute path and optional anchor.
 */
function resolveImportPath(sourceFileDir, importPath) {
  const rootDir = process.cwd(); // Assuming script runs from repo root
  const parts = importPath.split(/[:#]/); // Split by ':' (mdbook) or '#' (others)
  const relativePath = parts[0];
  const anchor = parts.length > 1 ? parts[parts.length - 1] : null;

  // Construct the absolute path
  // path.resolve handles '../' correctly
  const absPath = path.resolve(rootDir, sourceFileDir, relativePath);

  return { absPath, anchor };
}

/**
 * Reads file content, caching results.
 */
const fileCache = new Map();
function readFileContent(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }
  try {
    // Use synchronous read for simplicity within the loop, consider async if performance is critical
    const content = fsSync.readFileSync(filePath, 'utf-8');
    fileCache.set(filePath, content);
    return content;
  } catch (error) {
    console.warn(
      `  [Warning] Failed to read import file: ${filePath}. Error: ${error.message}`
    );
    return null; // Return null on error
  }
}

/**
 * Reads file content with a fallback to the parent directory of sourceFileDir.
 * @param {string} sourceFileDir - The primary source directory.
 * @param {string} relativeImportPath - The relative path from the import directive (WITHOUT anchor).
 * @param {string} rawImportStr - The original import string for error messages.
 * @returns {{ content: string | null, usedFallback: boolean }} - File content and whether fallback was used.
 */
function readFileWithFallback(sourceFileDir, relativeImportPath, rawImportStr) {
  const rootDir = process.cwd();

  // Attempt 1: Resolve relative to sourceFileDir
  const primaryAbsPath = path.resolve(
    rootDir,
    sourceFileDir,
    relativeImportPath
  );
  let content = readFileContent(primaryAbsPath);

  if (content !== null) {
    return { content, usedFallback: false };
  }

  // Attempt 2: Resolve relative to parent of sourceFileDir
  const fallbackBaseDir = path.resolve(rootDir, sourceFileDir, '..');
  const fallbackAbsPath = path.resolve(fallbackBaseDir, relativeImportPath);
  content = readFileContent(fallbackAbsPath);

  if (content !== null) {
    return { content, usedFallback: true };
  }

  // Both failed
  console.warn(
    `  [Warning] Both primary and fallback paths failed for import: ${rawImportStr}`
  );
  return { content: null, usedFallback: false };
}

// --- Snippet Extraction Logic (to be adapted from plugins) ---

// Placeholder for mdbook-style include extraction
function extractMdBookSnippet(content, anchor) {
  // TODO: Adapt logic from mdbook-example-import.ts (extractCommentBlock)
  // Simple placeholder for now
  if (!anchor) return content;
  const lines = content.split('\n');
  const startRegex = new RegExp(`(?:\\/\\/|#)\\s*ANCHOR\\s*:\\s*${anchor}`);
  const endRegex = new RegExp(`(?:\\/\\/|#)\\s*ANCHOR_END\\s*:\\s*${anchor}`);
  let inBlock = false;
  const resultLines = [];
  for (const line of lines) {
    if (endRegex.test(line)) {
      inBlock = false;
    }
    if (inBlock && !startRegex.test(line)) {
      // Basic dedent
      const leadingSpace = line.match(/^\\s*/)?.[0].length || 0;
      // Simple heuristic: remove up to 2 spaces for now, needs refinement
      const dedentedLine = line.substring(Math.min(leadingSpace, 2));
      resultLines.push(dedentedLine);
    }
    if (startRegex.test(line)) {
      inBlock = true;
    }
  }
  return resultLines.length > 0
    ? resultLines.join('\n')
    : `[Snippet for ${anchor} not found]`;
}

// Placeholder for CodeImport extraction
function extractCodeImportSnippet(
  content,
  { comment, lineStart, lineEnd /* ... other attrs */ }
) {
  // TODO: Adapt logic from code-import.ts (extractCommentBlock, extractLines, extractTestCase)
  return `[CodeImport snippet: comment=${comment}, lines=${lineStart}-${lineEnd}]`;
}

// Placeholder for Text Import extraction
function extractTextImportSnippet(content, anchor) {
  // TODO: Similar logic to mdbook, potentially simpler
  return extractMdBookSnippet(content, anchor); // Reuse for now
}

// --- Main Processing Logic ---

async function findExtractAndSave() {
  let totalFilesProcessed = 0;
  let filesWithImports = 0;
  let filesSaved = 0;
  console.log(`Searching for files in ${sourceDir}...`);
  console.log(`Outputting .md files to ${outputBaseDir}`);

  try {
    // Ensure output base directory exists
    await fs.mkdir(outputBaseDir, { recursive: true });

    const files = await fs.readdir(sourceDir);
    const matchingFiles = files.filter(
      (file) => file.startsWith(filePrefix) && file.endsWith(fileSuffix)
    );

    if (matchingFiles.length === 0) {
      console.log('No matching files found.');
      return;
    }

    console.log(`Found ${matchingFiles.length} matching files. Processing...`);

    for (const file of matchingFiles) {
      const sourceFilePath = path.join(sourceDir, file);
      totalFilesProcessed++;

      // --- Skip fuels-ts files ---
      if (file.includes('__fuels-ts__')) {
        // console.log(`Skipping fuels-ts file: ${file}`); // Optional logging
        continue; // Move to the next file
      }
      // --- End skip ---

      // --- Skip guides files ---
      if (file.includes('__guides__')) {
        // console.log(`Skipping guides file: ${file}`); // Optional logging
        continue; // Move to the next file
      }
      // --- End skip ---

      // --- Skip fuels-wallet files ---
      if (file.includes('__fuels-wallet__')) {
        // console.log(`Skipping fuels-wallet file: ${file}`); // Optional logging
        continue; // Move to the next file
      }
      // --- End skip ---

      try {
        const content = await fs.readFile(sourceFilePath, 'utf-8');
        const jsonData = JSON.parse(content);

        if (
          jsonData?.body?.raw &&
          typeof jsonData.body.raw === 'string' &&
          jsonData._raw?.sourceFileDir
        ) {
          const rawMarkdown = jsonData.body.raw;
          const sourceFileDir = jsonData._raw.sourceFileDir;

          console.log(`\n--- Processing: ${file} ---`);
          console.log(`  Source Directory: ${sourceFileDir}`);

          let modifiedMarkdown = rawMarkdown;
          let importsFound = false;

          // 1. Process {{#include ...}} directives
          modifiedMarkdown = modifiedMarkdown.replace(
            /```([^\n]*)?\n?(\{\{#include\s+([^}]+)\}\})\n?```/gs,
            (match, lang, includeDirective, importPath) => {
              importsFound = true;
              console.log(
                `  Found include: ${includeDirective} with lang specifier: '${
                  lang || ''
                }'`
              );
              const { absPath: primaryAbsPathForExt, anchor } =
                resolveImportPath(sourceFileDir, importPath);
              const relativePathOnly = importPath.split(/[:#]/)[0];
              const { content: importedContent, usedFallback } =
                readFileWithFallback(
                  sourceFileDir,
                  relativePathOnly,
                  includeDirective
                );

              if (importedContent === null) {
                return `\`\`\`${
                  lang || ''
                }\n[Error: Failed to read ${relativePathOnly} (from ${includeDirective}) via primary/fallback paths.]\n\`\`\``;
              }
              const snippet = extractMdBookSnippet(importedContent, anchor);
              // Replace only the include directive within the block
              return `\`\`\`${lang || ''}\n${snippet}\n\`\`\``;
            }
          );

          // 3. Process <CodeImport ...> directives (requires parsing attributes)
          // This is more complex due to JSX-like attributes
          // We'll do a simpler regex for now, might need a proper parser later
          modifiedMarkdown = modifiedMarkdown.replace(
            /<CodeImport\s+([^>]+)\/>/g,
            (match, attrsStr) => {
              importsFound = true;
              console.log(`  Found CodeImport: ${match}`);

              // Basic attribute parsing (might be fragile)
              const attrs = {};
              attrsStr.match(/(\w+)=\"([^\"]+)\"/g)?.forEach((attr) => {
                const [_, key, value] = attr.match(/(\w+)=\"([^\"]+)\"/);
                attrs[key] = value;
              });

              if (!attrs.file) {
                return `\`\`\`\n[Error: CodeImport missing 'file' attribute in ${match}]\n\`\`\``;
              }

              // Extract potential anchor from file attribute
              const { absPath: primaryAbsPathForExt, anchor } =
                resolveImportPath(sourceFileDir, attrs.file);
              const relativePathOnly = attrs.file.split(/[:#]/)[0];

              // Read file using fallback logic
              const { content: importedContent, usedFallback } =
                readFileWithFallback(sourceFileDir, relativePathOnly, match);

              if (importedContent === null) {
                return `\`\`\`\n[Error: Failed to read ${relativePathOnly} (from ${attrs.file}) via primary/fallback paths.]\n\`\`\``;
              }

              // TODO: Pass actual attrs to extractCodeImportSnippet
              const snippet = extractCodeImportSnippet(importedContent, {
                ...attrs,
                anchor,
              });
              const lang =
                attrs.lang || path.extname(primaryAbsPathForExt).substring(1);

              // Replace the directive with a new code block
              return `\`\`\`${lang}\n${snippet}\n\`\`\``;
            }
          );

          // --- Save the MODIFIED markdown content ---
          // 1. Generate relative path for output
          const relativeOutputPath = file
            .replace(/\.json$/, '') // Remove .json suffix
            .replace(/\.mdx$/, '.md') // Ensure .md extension
            .replace(/__/g, '/'); // Replace __ with /

          // 2. Construct full output path
          const outputFilePath = path.join(outputBaseDir, relativeOutputPath);

          // 3. Ensure subdirectory exists
          await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

          // 4. Write the MODIFIED .md file
          await fs.writeFile(outputFilePath, modifiedMarkdown, 'utf-8');
          filesSaved++;
          // console.log(`  -> Saved raw markdown to: ${path.relative(process.cwd(), outputFilePath)}`); // Comment out old log
          console.log(
            `  -> Saved processed markdown to: ${path.relative(
              process.cwd(),
              outputFilePath
            )}`
          );

          // --- Original Import Directive Logging (Optional - Keep for debugging?) ---
          if (importsFound) {
            filesWithImports++;
            // Optional: Log original directives found if needed
            console.log('  --- Original Import Directives Were Found ---');
            if (jsonData._raw.sourceFileDir) {
              console.log(
                `    Original Source Dir: ${jsonData._raw.sourceFileDir}`
              );
            }
            // Could add logging for specific directives here if useful
          } else {
            console.log('  --- No import directives found --- ');
          }
        } else {
          console.warn(
            `\nWarning: Could not find 'body.raw' (string) in ${file}. Skipping markdown extraction.`
          );
        }
      } catch (readError) {
        console.error(`\nError processing file ${file}:`, readError.message);
      }
    }

    console.log('\n--- Summary ---');
    console.log(`Total source files processed: ${totalFilesProcessed}`);
    console.log(`Raw markdown files saved: ${filesSaved}`);
    console.log(`Files containing import directives: ${filesWithImports}`);
  } catch (dirError) {
    console.error('Error accessing directories:', dirError);
  }
}

findExtractAndSave();
