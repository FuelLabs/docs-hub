import * as path from 'path';
import * as fs from 'fs-extra';
import { glob } from 'glob';

// Using a relative path from the script file itself should be robust
const scriptDir = __dirname;
const workspaceRoot = path.resolve(scriptDir, '..'); // Assuming script is in mono-mdbook-final-generator

const verifiedAddressesDocsPath = path.join(workspaceRoot, 'docs', 'verified-addresses', 'docs');
const sourceMdBookSrcPath = path.join(verifiedAddressesDocsPath, 'src');
const sourceMdBookToml = path.join(verifiedAddressesDocsPath, 'book.toml');
const sourceMdBookSummary = path.join(sourceMdBookSrcPath, 'SUMMARY.md');

const finalMdbookDestPath = path.join(workspaceRoot, 'mono-mdbook-final', 'verified-addresses-book');
const finalMdbookDestSrcPath = path.join(finalMdbookDestPath, 'src');

// --- Helper Functions ---

/**
 * Extracts a code snippet from a file based on anchor tags.
 * @param codeFilePath Absolute path to the code file.
 * @param anchor Optional anchor name (e.g., 'my_anchor').
 * @returns The extracted and cleaned code snippet.
 */
async function getCodeSnippet(codeFilePath: string, anchor?: string): Promise<string> {
    if (!await fs.pathExists(codeFilePath)) {
        console.warn(`WARN: Code file not found: ${codeFilePath}`);
        return `// Code file not found: ${codeFilePath}`;
    }

    const content = await fs.readFile(codeFilePath, 'utf-8');
    const lines = content.split('\n');

    if (!anchor) {
        // Return full content, removing any anchor tags
        return lines
            .filter(line => !line.trim().startsWith('// ANCHOR:') && !line.trim().startsWith('// ANCHOR_END:'))
            .join('\n');
    }

    const startAnchor = `// ANCHOR: ${anchor}`;
    const endAnchor = `// ANCHOR_END: ${anchor}`;
    let inSnippet = false;
    const snippetLines: string[] = [];

    for (const line of lines) {
        if (line.trim().includes(startAnchor)) {
            inSnippet = true;
            continue; // Skip the ANCHOR line itself
        }
        if (line.trim().includes(endAnchor)) {
            inSnippet = false;
            break; // Stop processing after finding the end anchor
        }
        if (inSnippet) {
            // Filter out ANCHOR/ANCHOR_END comments *within* the snippet if somehow nested
            if (!line.trim().startsWith('// ANCHOR:') && !line.trim().startsWith('// ANCHOR_END:')) {
               snippetLines.push(line);
            }
        }
    }

     if (snippetLines.length === 0 && !lines.some(l => l.includes(startAnchor))) {
         console.warn(`WARN: Anchor '${anchor}' start tag not found in file: ${codeFilePath}`);
         return `// Anchor '${anchor}' not found in ${codeFilePath}`;
     } else if (snippetLines.length === 0) {
        // Start anchor found, but no content or end anchor?
        console.warn(`WARN: Anchor '${anchor}' found but contains no lines (or end tag missing?) in file: ${codeFilePath}`);
        return `// Anchor '${anchor}' empty or end tag missing in ${codeFilePath}`;
     }

    return snippetLines.join('\n');
}

/**
 * Processes a single markdown file, replacing includes with code snippets.
 * @param mdFilePath Absolute path to the source markdown file.
 * @param outputSrcDir Absolute path to the output 'src' directory.
 * @param sourceSrcDir Absolute path to the source 'src' directory.
 */
async function processMarkdownFile(mdFilePath: string, outputSrcDir: string, sourceSrcDir: string): Promise<void> {
    console.log(`Processing: ${path.relative(workspaceRoot, mdFilePath)}`);
    const content = await fs.readFile(mdFilePath, 'utf-8');
    let processedContent = content;
    // Regex to find {{#include path/to/file.rs:optional_anchor}} - Improved to handle spaces better
    const includeRegex = /\{\{#include\s+([^:}\s]+)(?::([^\s}]+))?\s*\}\}/g;

    let match;
    const promises: Promise<void>[] = [];

    // Store replacements to apply after all async operations are done
    const replacements: { fullMatch: string, replacement: string }[] = [];

    while ((match = includeRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const relativePath = match[1].trim(); // Path relative to the md file
        const anchor = match[2]?.trim(); // Optional anchor name

        // Resolve the absolute path to the code file relative to the *markdown file's directory*
        const codeFilePath = path.resolve(path.dirname(mdFilePath), relativePath);

        console.log(`  Including ${relativePath}${anchor ? ` (anchor: ${anchor})` : ''}`);

        // Create a promise to get the snippet and determine replacement
        const promise = getCodeSnippet(codeFilePath, anchor).then(codeSnippet => {
            const fileExtension = path.extname(relativePath).substring(1);
            const langMap: { [key: string]: string } = {
                rs: 'rust',
                ts: 'typescript',
                js: 'javascript',
                py: 'python',
                sh: 'bash',
                toml: 'toml',
                sw: 'sway', // Added sway
                json: 'json',
                // Add more mappings as needed
            };
            const lang = langMap[fileExtension] || ''; // Default to no language hint
            const replacement = `\`\`\`${lang}\n${codeSnippet}\n\`\`\``;
            replacements.push({ fullMatch, replacement });
        }).catch(error => {
            console.error(`ERROR processing include ${fullMatch} in ${mdFilePath}:`, error);
            // Replace with error message in the doc
            const replacement = `\`\`\`\n// ERROR: Failed to include code snippet from ${relativePath}${anchor ? `:${anchor}` : ''}\n// ${error}\n\`\`\``;
            replacements.push({ fullMatch, replacement });
        });
        promises.push(promise);
    }

    // Wait for all snippets to be fetched
    await Promise.all(promises);

    // Perform replacements after all promises resolve
    // Replace in reverse order of appearance to avoid index issues with multiple matches
    replacements.reverse().forEach(({ fullMatch, replacement }) => {
        // Use a simple string replacement, assuming matches are unique enough for this context
        processedContent = processedContent.replace(fullMatch, replacement);
    });


    // Determine the relative path within the source src directory
    const relativeMdPath = path.relative(sourceSrcDir, mdFilePath);
    const outputFilePath = path.join(outputSrcDir, relativeMdPath);

    // Ensure the output directory exists
    await fs.ensureDir(path.dirname(outputFilePath));

    // Write the processed file
    await fs.writeFile(outputFilePath, processedContent);
    console.log(`  -> Wrote: ${path.relative(workspaceRoot, outputFilePath)}`);
}


// --- Main Execution ---

async function main() {
    console.log('Starting Verified Addresses mdBook generation...');
    console.log(`Workspace Root: ${workspaceRoot}`);
    console.log(`Script Directory: ${scriptDir}`);
    console.log(`Source Docs Path: ${verifiedAddressesDocsPath}`);
    console.log(`Final Dest Path: ${finalMdbookDestPath}`);

    if (!await fs.pathExists(verifiedAddressesDocsPath)) {
        console.error(`\n❌ ERROR: Source directory not found: ${verifiedAddressesDocsPath}`);
        console.error(`   Please ensure the submodule 'docs/verified-addresses' exists and is initialized.`);
        process.exit(1);
    }
     if (!await fs.pathExists(sourceMdBookSrcPath)) {
        console.error(`\n❌ ERROR: Source 'src' directory not found: ${sourceMdBookSrcPath}`);
        process.exit(1);
    }


    try {
        // 1. Prepare final destination directory
        console.log(`Clearing and preparing final destination directory: ${finalMdbookDestPath}`);
        await fs.emptyDir(finalMdbookDestPath);
        await fs.ensureDir(finalMdbookDestSrcPath); // Create the src directory

        // 2. Copy essential structure files
        console.log(`Copying book.toml from ${sourceMdBookToml}`);
        if (await fs.pathExists(sourceMdBookToml)) {
            await fs.copy(sourceMdBookToml, path.join(finalMdbookDestPath, 'book.toml'));
            console.log(`  -> Copied book.toml to ${finalMdbookDestPath}`);
        } else {
             console.warn(`WARN: Source book.toml not found at ${sourceMdBookToml}. Skipping.`);
        }

        console.log(`Copying SUMMARY.md from ${sourceMdBookSummary}`);
         if (await fs.pathExists(sourceMdBookSummary)) {
            await fs.copy(sourceMdBookSummary, path.join(finalMdbookDestSrcPath, 'SUMMARY.md'));
            console.log(`  -> Copied SUMMARY.md to ${finalMdbookDestSrcPath}`);
        } else {
             console.warn(`WARN: Source SUMMARY.md not found at ${sourceMdBookSummary}. Skipping.`);
        }


        // 3. Find and process all markdown files (excluding SUMMARY.md)
        console.log(`Searching for Markdown files in ${sourceMdBookSrcPath}`);
        // Ensure glob path uses forward slashes for compatibility
        const globPattern = path.join(sourceMdBookSrcPath, '**', '*.md').replace(/\\/g, '/');
        const mdFiles = await glob(globPattern, { absolute: true });
        console.log(`Found ${mdFiles.length} Markdown files.`);

        const filesToProcess = mdFiles.filter(file => path.basename(file) !== 'SUMMARY.md');
        console.log(`Processing ${filesToProcess.length} files (excluding SUMMARY.md)...`);

        if (filesToProcess.length === 0) {
            console.warn('WARN: No Markdown files found to process (excluding SUMMARY.md). Check source directory and paths.');
        }

        // Process files sequentially to avoid potential race conditions with console logging or file access
        for (const file of filesToProcess) {
            await processMarkdownFile(file, finalMdbookDestSrcPath, sourceMdBookSrcPath);
        }

        console.log('------------------------------------');
        console.log(`✅ Verified Addresses mdBook generation complete!`);
        console.log(`   Pure Markdown book created in: ${finalMdbookDestPath}`);
        console.log(`\n   To serve this book locally, run:`);
        console.log(`   cd ${path.relative(workspaceRoot, finalMdbookDestPath)} && mdbook serve`);
        console.log('------------------------------------');

    } catch (error) {
        console.error('\n❌ An error occurred during the process:');
        console.error(error);
        process.exit(1);
    }
}

main();
