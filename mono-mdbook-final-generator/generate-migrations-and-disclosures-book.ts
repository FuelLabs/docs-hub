import fs from 'fs/promises';
import path from 'path';

// Define paths using absolute paths from the workspace root
const workspaceRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(workspaceRoot, 'docs', 'migrations-and-disclosures', 'docs');
const bookDir = path.join(workspaceRoot, 'mono-mdbook-final', 'migrations-and-disclosures-book');
const targetDir = path.join(bookDir, 'src');

const includeRegex = /{{#include\s+([^:]+?)(?::([^}]+))?}}/g;
// Regex to find anchors, capturing the content in between
const anchorRegex = (anchor: string) =>
  new RegExp(
    `^[ \t]*\/\/\s*ANCHOR:\s*${anchor}\\r?\\n([\\s\\S]*?)\\r?\\n[ \t]*\/\/\s*ANCHOR_END:\s*${anchor}`, 'gm' // Added ^, \s*, gm
  );
// Regex to find markdown links like [text](./path/to/file.md) or [text](path/to/file.md)
const summaryLinkRegex = /\[.*?\]\((.\/)?(.*?\.md)\)/g; // Simplified and captures relative path better

// Mapping file extensions to markdown language identifiers
const languageMap: { [key: string]: string } = {
  '.rs': 'rust',
  '.ts': 'typescript',
  '.js': 'javascript',
  '.py': 'python',
  '.sol': 'solidity',
  '.sh': 'bash',
  '.toml': 'toml',
  '.json': 'json',
  '.md': 'markdown',
  '.sw': 'sway', // Added sway
  // Add other languages as needed
};

async function getLanguage(filePath: string): Promise<string> {
  const ext = path.extname(filePath);
  return languageMap[ext] || ''; // Default to empty string if no language found
}


async function processMarkdownFile(filePath: string): Promise<void> {
  const absoluteFilePath = path.join(sourceDir, filePath);
  const fileDir = path.dirname(absoluteFilePath);
  // Remove the prefix 'src/' from the target path to avoid nesting
  const adjustedFilePath = filePath.startsWith('src/') ? filePath.substring(4) : filePath;
  const targetFilePath = path.join(targetDir, adjustedFilePath);
  const targetFileDir = path.dirname(targetFilePath);

  console.log(`Processing ${filePath}...`);

  try {
    // Ensure the source file exists before trying to read
    if (!await fileExists(absoluteFilePath)) {
        console.warn(`  Skipping processing for non-existent source file: ${absoluteFilePath}`);
        return; // Skip this file if it doesn't exist in source
    }

    let content = await fs.readFile(absoluteFilePath, 'utf-8');
    let updatedContent = content; // Start with original content

    // Use a placeholder array to manage replacements sequentially
    const replacements: { placeholder: string; replacement: string }[] = [];
    let placeholderIndex = 0;
    const placeholderPrefix = "___INCLUDE_PLACEHOLDER_";

    // First pass: Identify all includes and generate placeholders
    let match;
    // Need to reset lastIndex since we are re-using the global regex
    includeRegex.lastIndex = 0;
    while ((match = includeRegex.exec(content)) !== null) {
      const [fullMatch, includePathRaw, anchorName] = match;
      const placeholder = `${placeholderPrefix}${placeholderIndex++}___`;
      // Replace only the *first* occurrence of fullMatch with the placeholder for this iteration
      // This handles cases where the same include might appear multiple times.
      // A more robust way might involve indices, but this is simpler for now.
      updatedContent = updatedContent.replace(fullMatch, placeholder);

      const includePath = includePathRaw.trim();
      const absoluteIncludePath = path.resolve(fileDir, includePath); // Resolve path relative to the MD file

      console.log(`  Found include: ${includePath}` + (anchorName ? ` anchor: ${anchorName.trim()}` : ''));

      replacements.push({ placeholder, replacement: await processInclude(absoluteIncludePath, anchorName?.trim(), includePath, absoluteFilePath) });

      // Add a small delay or use setImmediate to allow the event loop to process potential I/O operations
      // before the next potentially heavy replacement step. This might help slightly with large files/many includes.
      await new Promise<void>(resolve => setImmediate(resolve));
    }

    // Second pass: Replace placeholders with processed content
    for (const { placeholder, replacement } of replacements) {
      updatedContent = updatedContent.replace(placeholder, replacement);
    }


    // Create directory if it doesn't exist
    await fs.mkdir(targetFileDir, { recursive: true });
    // Write the final processed content
    await fs.writeFile(targetFilePath, updatedContent);
    console.log(`  Successfully wrote processed file to ${targetFilePath}`);

  } catch (err) {
     console.error(`Error processing file ${absoluteFilePath}:`, err);
  }
}

async function processInclude(absoluteIncludePath: string, anchorName: string | undefined, includePath: string, referencingFile: string): Promise<string> {
     if (!await fileExists(absoluteIncludePath)) {
         console.warn(`    WARNING: Included file not found: ${absoluteIncludePath} (referenced in ${referencingFile})`);
         // Return a more mdbook-friendly error message
         return `{{#include (FILE NOT FOUND): ${includePath}}}`;
     }

     try {
         const sourceCode = await fs.readFile(absoluteIncludePath, 'utf-8');
         let codeSnippet = sourceCode;

         if (anchorName) {
           // Reset regex state for each use (important for global 'g' flag)
           const regex = anchorRegex(anchorName);
           let anchorMatch;
           let extractedSnippets: string[] = [];

           // Find all matches for the anchor within the file
           while ((anchorMatch = regex.exec(sourceCode)) !== null) {
               if (anchorMatch[1] !== undefined) {
                   extractedSnippets.push(anchorMatch[1]);
               }
           }

           if (extractedSnippets.length > 0) {
               // If multiple anchors found, concatenate them? Or just use the first?
               // Current behavior: uses the content from the *last* match due to loop structure.
               // Let's concatenate them, separated by a newline, as that might be intended for fragmented examples.
               // However, mdbook standard includes typically expect one anchor match. Using the first is safer.
               if (extractedSnippets.length > 1) {
                  console.warn(`    WARNING: Multiple anchors named "${anchorName}" found in ${absoluteIncludePath}. Using the first occurrence.`);
               }
               codeSnippet = extractedSnippets[0]; // Use the first match's content

               // Clean the snippet
               codeSnippet = codeSnippet.replace(/^\s*\/\/\s*ANCHOR:.*$/gm, '');
               codeSnippet = codeSnippet.replace(/^\s*\/\/\s*ANCHOR_END:.*$/gm, '');
               codeSnippet = codeSnippet.replace(/^\s*\n|\n\s*$/g, ''); // Remove leading/trailing blank lines
               // codeSnippet = codeSnippet.trim(); // Trim whitespace

           } else {
               console.warn(`    WARNING: Anchor "${anchorName}" not found in ${absoluteIncludePath}`);
                // Return a more mdbook-friendly error message
               codeSnippet = `{{#include (ANCHOR NOT FOUND: ${anchorName}): ${includePath}}}`;
                return codeSnippet; // Return raw error snippet, not in code block
           }
         } else {
            // If no anchor, include the whole file, removing all anchor tags
            codeSnippet = codeSnippet.replace(/^\s*\/\/\s*ANCHOR:.*$/gm, '');
            codeSnippet = codeSnippet.replace(/^\s*\/\/\s*ANCHOR_END:.*$/gm, '');
            // codeSnippet = codeSnippet.trim(); // Trim the whole file content
         }

         const language = await getLanguage(absoluteIncludePath);
         return `\`\`\`${language}\n${codeSnippet}\n\`\`\``; // Return the formatted snippet

     } catch (err) {
         console.error(`    Error reading included file ${absoluteIncludePath}:`, err);
          // Return a more mdbook-friendly error message
         return `{{#include (ERROR READING FILE): ${includePath}}}`;
     }
}


async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Recursively find all .md files in a directory
async function findMdFiles(dir: string): Promise<string[]> {
    let results: string[] = [];
    try {
        // Check if the source directory itself exists first
         if (!await fileExists(dir)) {
             console.warn(`Source directory ${dir} does not exist.`);
             return []; // Return empty if source dir is missing
         }

        const list = await fs.readdir(dir, { withFileTypes: true });
        for (const dirent of list) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                // Exclude target directory to prevent infinite loops if source is subdir of target (or vice versa, unlikely here)
                 if(res === path.resolve(targetDir)) {
                     console.log(`Skipping target directory ${res} during scan.`);
                     continue;
                 }
                // Exclude common VCS/config directories
                if (dirent.name === '.git' || dirent.name === 'node_modules') {
                    continue;
                }
                results = results.concat(await findMdFiles(res));
            } else if (dirent.isFile() && res.endsWith('.md')) {
                // Store path relative to the original sourceDir
                results.push(path.relative(sourceDir, res));
            }
        }
    } catch (err) {
        // Log other errors during listing/recursion
        console.error(`Error scanning directory ${dir}:`, err);
        // Depending on desired behavior, you might want to re-throw or just return partial results
        // throw err;
    }
    return results;
}


async function main() {
  console.log('Starting mdBook generation for migrations-and-disclosures...');
  console.log(`Source directory: ${sourceDir}`);
  console.log(`Target directory: ${targetDir}`);

  try {
    // Ensure target directory exists and is empty
    console.log(`Cleaning target directory: ${targetDir}`);
    // Remove entire book directory and recreate
    await fs.rm(bookDir, { recursive: true, force: true });
    await fs.mkdir(bookDir, { recursive: true });
    await fs.mkdir(targetDir, { recursive: true });

    // --- Processing Logic ---
    // 1. Find ALL .md files recursively in the source directory
    const allMdFiles = await findMdFiles(sourceDir);
     if (!allMdFiles || allMdFiles.length === 0) {
         console.warn("No markdown files found in source directory or source directory does not exist. Exiting.");
         return; // Exit if no files found or source missing
     }
     console.log(`Found ${allMdFiles.length} markdown files to process.`);


    // 2. Copy necessary config/static files
     const summarySourcePath = path.join(sourceDir, 'SUMMARY.md');
     const summaryTargetPath = path.join(targetDir, 'SUMMARY.md');
     if (await fileExists(summarySourcePath)) {
         // Copy SUMMARY.md first
         await fs.copyFile(summarySourcePath, summaryTargetPath);
         console.log(`Copied SUMMARY.md to ${targetDir}`);
     } else {
         console.warn("Warning: SUMMARY.md not found in source directory.");
         // Proceeding without SUMMARY.md, mdbook might complain later or build default nav
     }

     // Copy book.toml if it exists in the source documentation structure
     // Usually located one level above 'src' relative to sourceDir
     const bookTomlSourcePath = path.join(sourceDir, '../', 'book.toml');
     const bookTomlTargetDirPath = path.dirname(targetDir); // Target book dir: 'mono-mdbook-final/migrations-and-disclosures-book'
     const bookTomlTargetPath = path.join(bookTomlTargetDirPath, 'book.toml'); // Target path is in the book's root dir
      if (await fileExists(bookTomlSourcePath)) {
         await fs.copyFile(bookTomlSourcePath, bookTomlTargetPath);
         console.log(`Copied book.toml to ${bookTomlTargetDirPath}`);
      } else {
         console.log("Info: book.toml not found in source structure, creating a default.");
         // Create a default book.toml in the target *book* directory
         const defaultBookToml = `[book]\nsrc = "src"\ntitle = "Migrations and Disclosures"\n\n[output.html]\ntheme = "theme"\n`;
         await fs.writeFile(bookTomlTargetPath, defaultBookToml);
         console.log(`Created default book.toml in ${bookTomlTargetDirPath}`);
      }

      // Copy theme directory if it exists in the source structure
       const themeSourceDir = path.join(sourceDir, '../', 'theme');
       const themeTargetDir = path.join(bookTomlTargetDirPath, 'theme'); // Target theme dir
        if (await fileExists(themeSourceDir)) {
            console.log(`Copying theme directory from ${themeSourceDir} to ${themeTargetDir}`);
            // Ensure target theme parent dir exists (should be covered by bookTomlTargetDirPath)
            // await fs.mkdir(themeTargetDir, { recursive: true }); // mkdir -p
            await fs.cp(themeSourceDir, themeTargetDir, { recursive: true }); // Use fs.cp for directory copy
        } else {
            console.log("Info: Theme directory not found in source structure, skipping copy.");
            // Create an empty theme dir if needed by mdbook, especially if default book.toml references it
            await fs.mkdir(themeTargetDir, { recursive: true });
        }


    // 3. Process each markdown file found
    // Process SUMMARY.md *after* copying if it needs include resolution itself.
    // The allMdFiles list should contain SUMMARY.md if it exists.
    const processPromises = allMdFiles.map(mdFile => processMarkdownFile(mdFile));
    await Promise.all(processPromises); // Process files concurrently

    console.log('Finished processing all markdown files.');

  } catch (err) {
    console.error('Error during book generation:', err);
    process.exit(1);
  }
}

// Wrap main execution in a self-calling async function to use await at top level
(async () => {
    await main();
})().catch(err => {
    console.error("Unhandled error during script execution:", err);
    process.exit(1);
}); 