import fs from 'fs-extra';
import path from 'path';

// --- Function to find workspace root ---
function findWorkspaceRoot(startDir: string): string {
    let currentDir = startDir;
    while (true) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        const gitDirPath = path.join(currentDir, '.git'); // Also check for .git
        if (fs.existsSync(packageJsonPath) && fs.existsSync(gitDirPath)) {
             // Check if it's the *root* package.json, not the script's one
             try {
                 const pkg = fs.readJsonSync(packageJsonPath);
                 // Add a heuristic: root package.json often has workspaces defined
                 // or lacks a 'main' pointing to a script within the generator folder
                 if (pkg.workspaces || !pkg.main?.includes('generator')) {
                     return currentDir;
                 }
             } catch (e) {
                 // Ignore errors reading json
             }
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            throw new Error('Could not find workspace root containing package.json and .git');
        }
        currentDir = parentDir;
    }
}

// --- Configuration ---
const SCRIPT_DIR = __dirname; // Or use import.meta.url if in ESM context and needed
const WORKSPACE_ROOT = findWorkspaceRoot(SCRIPT_DIR);

// Source directory of the original fuel-book markdown files
const SOURCE_DIR = path.join(WORKSPACE_ROOT, 'docs/fuel-book/docs/src');
// Destination directory for the processed "pure" markdown files
const DEST_DIR = path.join(WORKSPACE_ROOT, 'mono-mdbook-final/fuel-book/src');
// Base directory from which #include paths are resolved
const CODE_BASE_DIR = path.join(WORKSPACE_ROOT, 'docs/fuel-book');
// Regex to find mdBook include directives
const includeRegex = /^{{#include\s+([^:]+)(?::(.*))?}}\s*$/;
// Regex for ANCHOR start comments (using // for comments)
const anchorStartRegex = /\/\/\s*ANCHOR:\s*(\S+)/;
// Regex for ANCHOR_END comments (using // for comments)
const anchorEndRegex = /\/\/\s*ANCHOR_END:\s*(\S+)/;
// Regex to match any ANCHOR or ANCHOR_END line
const anyAnchorRegex = /\/\/\s*ANCHOR(?:_END)?:\s*(\S+)/;


// --- Helper Functions ---

/**
 * Reads a code file, extracts relevant lines based on an optional anchor,
 * and filters out ANCHOR/ANCHOR_END comments.
 * @param codeFilePath Absolute path to the code file.
 * @param anchorName Optional anchor name to extract.
 * @param referencingFilePath Path of the markdown file referencing this code (for logging).
 * @returns Array of code lines or null if anchor not found.
 */
async function getCodeSnippet(codeFilePath: string, anchorName: string | null, referencingFilePath: string): Promise<string[] | null> {
    const codeContent = await fs.readFile(codeFilePath, 'utf-8');
    let codeLines = codeContent.split('\n');

    if (anchorName) {
        let inAnchor = false;
        let anchorFound = false;
        const anchorLines: string[] = [];
        for (const codeLine of codeLines) {
            const startMatch = codeLine.match(anchorStartRegex);
            const endMatch = codeLine.match(anchorEndRegex);

            if (startMatch && startMatch[1] === anchorName) {
                inAnchor = true;
                anchorFound = true;
                continue; // Skip the ANCHOR line itself
            }

            if (endMatch && endMatch[1] === anchorName) {
                inAnchor = false;
                continue; // Skip the ANCHOR_END line itself
            }

            if (inAnchor) {
                // Filter out *any* other anchor comments within the targeted block
                if (!anyAnchorRegex.test(codeLine)) {
                    anchorLines.push(codeLine);
                }
            }
        }
        // Return null if the specified anchor was never found
        if (!anchorFound) {
            console.warn(`WARN: Anchor '${anchorName}' not found in file ${codeFilePath} referenced by ${referencingFilePath}`);
            return null;
        }
        codeLines = anchorLines;
    } else {
        // Filter out *all* anchor comments if no specific anchor is requested
        codeLines = codeLines.filter(l => !anyAnchorRegex.test(l));
    }
    return codeLines;
}

/**
 * Processes a single markdown file, replacing #include directives.
 * @param filePath Absolute path to the markdown file.
 */
async function processMarkdownFile(filePath: string): Promise<void> {
    const relativeFilePath = path.relative(SOURCE_DIR, filePath);
    console.log(`Processing: ${relativeFilePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const processedLines: string[] = [];

    for (const line of lines) {
        const includeMatch = line.match(includeRegex);

        if (includeMatch) {
            const includePath = includeMatch[1].trim();
            const anchorName = includeMatch[2] ? includeMatch[2].trim() : null;
            // Resolve the include path relative to the CODE_BASE_DIR
            const codeFilePath = path.resolve(CODE_BASE_DIR, includePath);

            try {
                const codeLines = await getCodeSnippet(codeFilePath, anchorName, filePath);

                if (codeLines === null) {
                    // Anchor wasn't found, add an error comment
                    processedLines.push(`<!-- ERROR: Anchor '${anchorName}' not found in ${includePath} -->`);
                    continue;
                }

                // Determine the file extension for syntax highlighting
                const ext = path.extname(codeFilePath).substring(1);

                // Add code block only if there are lines or if an anchor was specified (even if empty)
                if (codeLines.length > 0 || anchorName) {
                    processedLines.push(`\`\`\`${ext}`);
                    processedLines.push(...codeLines);
                    processedLines.push(`\`\`\``);
                } else {
                    // No anchor specified, and the file (after filtering all anchors) is empty.
                    console.warn(`WARN: Included file ${includePath} resulted in empty content (no anchor specified) in ${relativeFilePath}`);
                    processedLines.push(`<!-- INFO: Included file ${includePath} was empty after filtering ANCHOR comments -->`);
                }
            } catch (error: any) {
                console.error(`ERROR: Could not read or process included file ${codeFilePath} (referenced in ${relativeFilePath}): ${error.message}`);
                processedLines.push(`<!-- ERROR: Could not include file ${includePath}. Reason: ${error.code === 'ENOENT' ? 'File not found' : error.message} -->`);
            }
        } else {
            processedLines.push(line);
        }
    }

    // Write the processed file to the destination
    const destPath = path.join(DEST_DIR, relativeFilePath);
    await fs.ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, processedLines.join('\n'));
}

/**
 * Recursively processes markdown files in a directory.
 * @param dir Directory to process.
 */
async function processDirectory(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip potentially hidden or unwanted directories
            if (entry.name.startsWith('.')) continue;
            await processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // Skip SUMMARY.md processing here, it will be copied later
            if (entry.name === 'SUMMARY.md') continue;
            await processMarkdownFile(fullPath);
        }
    }
}

// --- Main Execution ---

async function main() {
    console.log(`Starting Fuel Book generation...`);
    console.log(`Source:      ${SOURCE_DIR}`);
    console.log(`Destination: ${DEST_DIR}`);
    console.log(`Code Base:   ${CODE_BASE_DIR}`);

    try {
        // Ensure destination exists and is empty
        await fs.ensureDir(DEST_DIR);
        await fs.emptyDir(DEST_DIR);
        console.log('Destination directory cleared.');

        // Process all markdown files recursively
        await processDirectory(SOURCE_DIR);

        // Copy necessary non-markdown files and the SUMMARY.md
        console.log('Copying assets and SUMMARY.md...');
        await fs.copy(SOURCE_DIR, DEST_DIR, {
            filter: async (src) => {
                // Prevent infinite loop if DEST_DIR is inside SOURCE_DIR (it shouldn't be)
                if (src.startsWith(DEST_DIR)) {
                    return false;
                }
                // Skip hidden files/directories in the source
                if (path.basename(src).startsWith('.') && src !== SOURCE_DIR) {
                   // console.log(`Skipping hidden: ${src}`);
                   return false;
                }

                const stats = await fs.stat(src);
                const isMd = src.endsWith('.md');
                const isSummary = path.basename(src) === 'SUMMARY.md';

                // Copy directories (that aren't hidden), the SUMMARY.md file, and any non-markdown files
                // This prevents copying already processed .md files (except SUMMARY.md)
                if (stats.isDirectory()) {
                     // console.log(`Copying dir: ${src}`);
                    return true; // Let fs-extra handle recursive copy for directories
                }
                // console.log(`Checking file: ${src}, isMd: ${isMd}, isSummary: ${isSummary}`);
                return isSummary || !isMd;
            },
            overwrite: true,
            errorOnExist: false
        });

        console.log('\nFuel Book generation complete.');
        console.log(`Output written to: ${DEST_DIR}`);

    } catch (error) {
        console.error('\nError during Fuel Book generation process:', error);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('\nUnhandled error in main execution:', error);
    process.exit(1);
});
