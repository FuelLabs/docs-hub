import fsSync from 'fs'; // Need sync version for recursive calls
import path from 'path';
import fs from 'fs/promises';

// Cache for file content to avoid redundant reads
const fileCache = new Map();

/**
 * Reads file content, caching results.
 * @param {string} filePath - The absolute path to the file.
 * @returns {string | null} The file content or null if reading fails.
 */
function readFileContent(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }
  try {
    const content = fsSync.readFileSync(filePath, 'utf-8');
    fileCache.set(filePath, content);
    return content;
  } catch (error) {
    // console.warn(`  [Warning] Failed to read import file: ${filePath}. Error: ${error.message}`);
    // Return null on error, let the caller handle it
    return null;
  }
}

/**
 * Resolves the absolute path, anchor, and language options from a custom <<< @path#anchor{options} directive.
 * Assumes the path part is relative to the workspace root if it starts with '/'.
 * Otherwise, resolves relative to the source markdown file's directory.
 * @param {string} sourceFileDir - Directory of the source markdown file.
 * @param {string} directiveContent - The content inside the <<< @... directive (e.g., '/path/to/file.ts#myAnchor{ts:line-numbers}').
 * @returns {{ absPath: string | null, anchor: string | null, options: string | null, error?: string }}
 */
function resolveCustomImportPath(sourceFileDir, directiveContent) {
  const rootDir = process.cwd(); // Workspace root
  // Define the base directory for resolving paths starting with '/' or '@/', relative to the workspace root.
  const codeSourceDir = path.resolve(rootDir, 'docs/fuels-ts/apps/docs/src');

  // Regex to capture path, anchor, and optional {options}
  const match = directiveContent
    .trim()
    .match(/^([^#{]+)(?:[#:]([^#{]+))?(\{.*\})?$/);

  if (!match) {
    return {
      absPath: null,
      anchor: null,
      options: null,
      error: `Invalid directive format: ${directiveContent}`,
    };
  }

  const [, pathPartRaw, anchorRaw, options] = match;
  const pathPart = pathPartRaw.trim();
  const anchor = anchorRaw ? anchorRaw.trim() : null;

  if (!pathPart) {
    return {
      absPath: null,
      anchor: null,
      options: null,
      error: 'Import path is missing.',
    };
  }

  let absPath;

  // --- Apply detailed path resolution logic ---

  // Handle legacy case for @/../../docs/sway/ paths FIRST
  if (pathPart.startsWith('/../../docs/sway/')) {
    const swayPath = pathPart.substring('/../../docs/sway/'.length);
    absPath = path.join(rootDir, 'docs/fuels-ts/apps/docs/sway', swayPath);
  }
  // Handle legacy case for @/../../docs/nightly/sway/ paths FIRST
  else if (pathPart.startsWith('/../../docs/nightly/sway/')) {
    const swayPath = pathPart.substring('/../../docs/nightly/sway/'.length);
    absPath = path.join(
      rootDir,
      'docs/nightly/fuels-ts/apps/docs/sway',
      swayPath
    );
  }
  // --- If the specific legacy paths didn't match, try all other patterns ---
  else {
    // Handle special case for the create-fuels-counter-guide paths
    if (pathPart.startsWith('/../../create-fuels-counter-guide/')) {
      const counterGuidePath = pathPart.replace(
        '/../../create-fuels-counter-guide/',
        ''
      );
      absPath = path.resolve(
        rootDir,
        'docs/fuels-ts/apps/create-fuels-counter-guide',
        counterGuidePath
      );
    }
    // Handle demo files (demo-*, assumes they are under docs/fuels-ts/apps/)
    else if (pathPart.match(/^\/\.\.\/(\.\.\/)?demo-[a-zA-Z0-9-]+\//)) {
      const matches = pathPart.match(
        /^\/\.\.\/(?:\.\.\/)?(demo-[a-zA-Z0-9-]+)\/(.+)$/
      );
      if (matches) {
        const demoName = matches[1];
        const remainingPath = matches[2];
        absPath = path.resolve(
          rootDir,
          `docs/fuels-ts/apps/${demoName}`,
          remainingPath
        );
      } else {
        // Fallback for unparseable demo paths (treat as relative from markdown dir)
        const relativePath = pathPart.startsWith('/')
          ? pathPart.substring(1)
          : pathPart;
        absPath = path.resolve(sourceFileDir, relativePath);
      }
    }
    // Handle package files (like /../../../packages/account/...)
    else if (pathPart.startsWith('/../../../packages/')) {
      const packagePath = pathPart.replace('/../../../packages/', '');
      absPath = path.resolve(rootDir, 'docs/fuels-ts/packages', packagePath);
    }
    // Handle guide-related snippets (like /../../docs/src/guide/...)
    else if (pathPart.startsWith('/../../docs/src/guide/')) {
      const guidePath = pathPart.replace('/../../docs/src/guide/', '');
      absPath = path.resolve(
        rootDir,
        'docs/fuels-ts/apps/docs/src/guide',
        guidePath
      );
    }
    // Handle special case for @sway/ paths, resolving relative to the fuels-ts sway dir
    else if (pathPart.startsWith('@sway/')) {
      const swayPath = pathPart.substring('@sway/'.length);
      absPath = path.resolve(rootDir, 'docs/fuels-ts/apps/docs/sway', swayPath);
    }
    // Handle general case for paths starting with /../../ (relative to markdown file's dir)
    // Make sure it doesn't match the @/../../ patterns handled earlier
    else if (
      pathPart.startsWith('/../../') &&
      !pathPart.startsWith('@/../../')
    ) {
      const relativePath = pathPart.substring(1); // Keep the ../../ part for resolution
      absPath = path.resolve(sourceFileDir, relativePath);
    }
    // Treat both '/' and '@/' prefixes as relative to codeSourceDir
    else if (pathPart.startsWith('/') || pathPart.startsWith('@/')) {
      const prefixLength = pathPart.startsWith('/') ? 1 : 2;
      const relativePath = pathPart.substring(prefixLength);

      // Special case: If path starts like /../ or @/../ resolve relative to markdown file dir, not codeSourceDir
      // Make sure this doesn't accidentally catch our specific sway paths handled earlier.
      if (
        relativePath.startsWith('../') &&
        !relativePath.startsWith('../../docs/sway/') &&
        !relativePath.startsWith('../../docs/nightly/sway/')
      ) {
        absPath = path.resolve(sourceFileDir, relativePath);
      } else {
        absPath = path.resolve(codeSourceDir, relativePath);
      }
    } else {
      // Default: Treat as relative path from the markdown file's directory
      absPath = path.resolve(sourceFileDir, pathPart);
    }
  } // <<< Closing brace for the new large else block

  // --- End Path Resolution Logic ---

  if (!absPath) {
    // This case should ideally not be reached if the logic above is comprehensive
    return {
      absPath: null,
      anchor: null,
      options: null,
      error: `Path resolution failed for unknown reason: ${pathPart}`,
    };
  }

  // Normalize the path
  absPath = path.normalize(absPath);

  // Return the extracted parts
  return { absPath, anchor, options: options || null };
}

/**
 * Extracts a code snippet based on #region and #endregion markers.
 * @param {string} content - The full file content.
 * @param {string} anchor - The region name to extract.
 * @returns {string | null} - The extracted, dedented snippet or null if not found.
 */
function extractRegionSnippet(content, anchor) {
  if (!anchor || !content) {
    return null;
  }

  // --- Use indexOf approach inspired by the provided script ---
  const startMarker = `// #region ${anchor}`;
  const endMarker = `// #endregion ${anchor}`;

  const startIndex = content.indexOf(startMarker);
  let endIndex = -1;
  if (startIndex !== -1) {
    // Search for the end marker *after* the start marker
    endIndex = content.indexOf(endMarker, startIndex + startMarker.length);
  }

  if (startIndex === -1 || endIndex === -1) {
    // console.warn(`  [Warning] Region markers for '${anchor}' not found using indexOf.`);
    return null; // Markers not found
  }

  // Find the end of the line containing the start marker
  const startLineEndIndex = content.indexOf('\n', startIndex);
  if (startLineEndIndex === -1) {
    // This should not happen if the marker exists, but handle defensively
    return null;
  }
  const snippetStartIndex = startLineEndIndex + 1;

  // Find the beginning of the line containing the end marker
  // This is slightly trickier, go backwards from endIndex to find the preceding newline
  const snippetEndIndex = content.lastIndexOf('\n', endIndex);
  if (snippetEndIndex === -1 || snippetEndIndex < snippetStartIndex) {
    // If no newline before end marker or it overlaps start, handle edge case
    // This might happen if end marker is on the first line or directly after start
    return null; // Or potentially extract from snippetStartIndex to endIndex directly if appropriate
  }

  const extractedSnippet = content.substring(
    snippetStartIndex,
    snippetEndIndex
  );

  // --- Apply Dedenting Logic (similar to previous) ---
  const lines = extractedSnippet.split('\n');
  let minIndent = Number.Infinity;

  for (const line of lines) {
    const currentIndent = line.match(/^\s*/)?.[0].length || 0;
    if (line.trim().length > 0) {
      // Only consider indentation of non-empty lines
      minIndent = Math.min(minIndent, currentIndent);
    }
  }

  // Dedent the lines
  if (minIndent === Number.Infinity) minIndent = 0; // Handle empty regions or regions with no indented lines
  const dedentedLines = lines.map((line) => line.substring(minIndent));

  // Trim leading/trailing empty lines that might have been included
  while (dedentedLines.length > 0 && dedentedLines[0].trim() === '') {
    dedentedLines.shift();
  }
  while (
    dedentedLines.length > 0 &&
    dedentedLines[dedentedLines.length - 1].trim() === ''
  ) {
    dedentedLines.pop();
  }

  return dedentedLines.join('\n');
}

// --- Main Processing Function ---

/**
 * Finds all <<< @... directives in markdown content and replaces them with
 * the corresponding code snippets fetched using #region markers.
 * @param {string} markdownContent - The raw markdown string.
 * @param {string} sourceFileDir - The directory where the markdown file resides (for relative path resolution).
 * @returns {string} - The markdown content with includes processed.
 */
function processMarkdownIncludes(markdownContent, sourceFileDir) {
  const importRegex = /<<< @([^\n]+)/g; // Match <<< @ followed by anything until newline

  let processedContent = markdownContent;
  let match;

  // Collect replacements first to avoid issues with modifying the string while iterating
  const replacements = [];

  // Use a standard loop for iterating over regex matches
  importRegex.lastIndex = 0; // Reset regex state if used multiple times
  while (true) {
    match = importRegex.exec(markdownContent);
    if (match === null) {
      break; // No more matches
    }
    const fullDirective = match[0]; // e.g., <<< @/path/file.ts#anchor{ts}
    const directiveContent = match[1]; // e.g., /path/file.ts#anchor{ts}

    const {
      absPath,
      anchor,
      options,
      error: resolveError,
    } = resolveCustomImportPath(sourceFileDir, directiveContent);

    // --- NEW DEBUGGING START ---
    // console.log(`[DEBUG processMarkdownIncludes] After resolve: absPath = ${absPath}`); // DEBUG REMOVED
    // --- NEW DEBUGGING END ---

    if (resolveError) {
      replacements.push({
        find: fullDirective,
        replace: `\`\`\`\n[Error resolving import: ${resolveError}]\n\`\`\``,
      });
      continue;
    }

    if (!absPath) {
      replacements.push({
        find: fullDirective,
        replace: `\`\`\`\n[Error: Could not resolve path for ${directiveContent}]\n\`\`\``,
      });
      continue;
    }

    const fileContent = readFileContent(absPath);
    if (fileContent === null) {
      // --- NEW DEBUGGING START ---
      // console.log(`[DEBUG processMarkdownIncludes] Inside fileContent === null: absPath = ${absPath}`); // DEBUG REMOVED
      // --- NEW DEBUGGING END ---
      replacements.push({
        find: fullDirective,
        replace: `\`\`\`\n[Error reading file: ${absPath}]\n\`\`\``,
      });
      continue;
    }

    const snippet = extractRegionSnippet(fileContent, anchor);
    if (snippet === null) {
      const anchorMsg = anchor
        ? `region '${anchor}'`
        : 'region (anchor missing?)';
      replacements.push({
        find: fullDirective,
        replace: `\`\`\`\n[Error extracting ${anchorMsg} from ${absPath}]\n\`\`\``,
      });
      continue;
    }

    // Extract language hint from options, e.g., {ts:line-numbers} -> ts
    let language = '';
    if (options) {
      const langMatch = options.match(/^\\{([a-zA-Z]+)/);
      language = langMatch?.[1] || '';
    }

    const replacementBlock = `\`\`\`${language}\n${snippet}\n\`\`\``;
    replacements.push({ find: fullDirective, replace: replacementBlock });
  }

  // Apply replacements
  // Need to replace carefully if directives could be substrings of each other
  // For <<< @... likely safe to just replace sequentially
  for (const rep of replacements) {
    processedContent = processedContent.replace(rep.find, rep.replace);
  }

  return processedContent;
}

// --- Script Entry Point ---

const sourceDir = path.resolve('.contentlayer/generated/MdDoc');
const outputBaseDir = path.resolve('extract-md-files/docs/fuels-ts');
const filePrefix = 'docs__';
const targetSegment = 'fuels-ts'; // Filter for files containing 'fuels-ts' after prefix
const fileSuffix = '.json';

async function runExtraction() {
  console.log('Starting extraction process...');
  console.log(`Source directory: ${sourceDir}`);
  console.log(`Output directory: ${outputBaseDir}`);

  let filesProcessed = 0;
  let successCount = 0;
  let failureCount = 0;

  try {
    // Ensure output base directory exists
    await fs.mkdir(outputBaseDir, { recursive: true });

    const allFiles = await fs.readdir(sourceDir);
    const matchingFiles = allFiles.filter((file) => {
      if (!file.startsWith(filePrefix) || !file.endsWith(fileSuffix)) {
        return false;
      }
      // Check if 'fuels-ts' is part of the name after the prefix
      const namePart = file.substring(
        filePrefix.length,
        file.length - fileSuffix.length
      );
      return namePart.split('__').includes(targetSegment);
    });

    if (matchingFiles.length === 0) {
      console.log(
        `No matching '${targetSegment}' files found in ${sourceDir}.`
      );
      return;
    }

    console.log(`Found ${matchingFiles.length} matching files. Processing...`);

    for (const file of matchingFiles) {
      const sourceFilePath = path.join(sourceDir, file);
      filesProcessed++;
      let fileSuccess = false;

      try {
        const jsonContent = await fs.readFile(sourceFilePath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        if (
          jsonData?.body?.raw &&
          typeof jsonData.body.raw === 'string' &&
          jsonData._raw?.sourceFileDir
        ) {
          const rawMarkdown = jsonData.body.raw;
          const sourceFileDir = jsonData._raw.sourceFileDir;
          console.log(
            `  Source Directory (for relative paths): ${sourceFileDir}`
          );

          const processedMarkdown = processMarkdownIncludes(
            rawMarkdown,
            sourceFileDir
          );

          // Determine output path
          const namePart = file.substring(
            filePrefix.length,
            file.length - fileSuffix.length
          );
          const relativeOutputPath = `${namePart.split('__').join('/')}.md`;
          const outputFilePath = path.join(outputBaseDir, relativeOutputPath);

          // Ensure subdirectory exists
          await fs.mkdir(path.dirname(outputFilePath), { recursive: true });

          // Write the processed file
          await fs.writeFile(outputFilePath, processedMarkdown);
          console.log(
            `  Successfully saved processed file to: ${outputFilePath}`
          );
          fileSuccess = true;
        } else {
          console.warn(
            ` Skipping file ${file}: Invalid structure or missing fields.`
          );
        }
      } catch (error) {
        console.error(`  [Error] Processing file ${file}:`, error);
      }

      // Tally results for the file
      if (fileSuccess) {
        successCount++;
      } else {
        failureCount++;
      }
    }
  } catch (error) {
    console.error('Error during extraction process:', error);
  }

  console.log('\nExtraction finished.');
  console.log(`Total files matched in filter: ${filesProcessed}`);
  console.log(`Files processed successfully: ${successCount}`);
  console.log(`Files failed processing: ${failureCount}`);
}

// Execute the main function
runExtraction();
