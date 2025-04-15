import * as fs from 'fs/promises';
import * as path from 'path';

// Define base directories using __dirname for reliable path resolution
const scriptDir = __dirname;
const workspaceRoot = path.resolve(scriptDir, '..'); // Corrected: go up one level
const sourceBaseDir = path.resolve(workspaceRoot, 'docs/fuels-rs'); // Base for resolving include paths like ../../..
const sourceDocsDir = path.resolve(sourceBaseDir, 'docs/src');
const destRootDir = path.resolve(workspaceRoot, 'mono-mdbook-final/fuels-rs'); // Corrected output directory (no @)
const destDir = path.resolve(destRootDir, 'src'); // Actual content goes into src subdir
const summaryFileName = 'SUMMARY.md';

// Regex to find includes: {{#include <path>[:<tag>]}}
// Captures the path and optionally the tag.
const includeRegex = /^{{\s*#include\s+([^{}#:]+)(?::([^{}#]+))?\s*}}$/;
// Regex to find ANCHOR comments, ensuring tag is a word boundary
const anchorStartRegex = (tag: string) => new RegExp(`//\\s*ANCHOR:\\s*${tag}\\b`);
const anchorEndRegex = (tag: string) => new RegExp(`//\\s*ANCHOR_END:\\s*${tag}\\b`);
// Regex to find *any* ANCHOR start or end comment for cleanup
const anyAnchorRegex = /\/\/\s*ANCHOR(?:_END)?:\s*\S+/g;
// Regex to detect ``` lines
const codeFenceRegex = /^```/;


/**
 * Extracts a code snippet from a file based on anchor tags.
 * If no tag is provided or anchors aren't found, returns the whole file content.
 * Removes ANCHOR comments.
 */
async function extractCode(
    absoluteIncludePath: string,
    tag: string | undefined
): Promise<string | null> {
    try {
        const content = await fs.readFile(absoluteIncludePath, 'utf-8');
        const lines = content.split('\n');
        let relevantLines: string[] = [];

        if (tag) {
            const startRegex = anchorStartRegex(tag);
            const endRegex = anchorEndRegex(tag);
            // Find the line *number* (1-based) for easier debugging messages
            let startIndex = -1;
            let endIndex = -1;

            for (let i = 0; i < lines.length; i++) {
                 if (startIndex === -1 && startRegex.test(lines[i])) {
                     startIndex = i;
                 } else if (startIndex !== -1 && endRegex.test(lines[i])) {
                     endIndex = i;
                     break; // Found both, stop searching
                 }
            }


            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                // Exclude the anchor lines themselves
                relevantLines = lines.slice(startIndex + 1, endIndex);
                console.log(`    Extracted lines ${startIndex + 2}-${endIndex} using tag '${tag}'`);
            } else {
                 let reason = "unknown reason";
                 if(startIndex === -1) reason = `start anchor '// ANCHOR: ${tag}' not found`;
                 else if (endIndex === -1) reason = `end anchor '// ANCHOR_END: ${tag}' not found after line ${startIndex + 1}`;
                 else if (startIndex >= endIndex) reason = `start anchor found on/after end anchor (start: ${startIndex+1}, end: ${endIndex+1})`;

                console.warn(`    Warning: Could not extract snippet for tag '${tag}' from ${path.relative(workspaceRoot, absoluteIncludePath)} (${reason}). Including whole file.`);
                relevantLines = lines; // Fallback to whole file if anchors missing/invalid
            }
        } else {
             console.log(`    Including whole file (no tag specified).`);
            relevantLines = lines; // No tag means include whole file
        }

        // Clean any remaining anchor comments from the selected lines
        return relevantLines
            .filter(line => !anyAnchorRegex.test(line))
            .join('\n');
    } catch (error: any) {
         // Check if the error is because the file doesn't exist
         if (error.code === 'ENOENT') {
            console.error(`    Error: Include file not found: ${path.relative(workspaceRoot, absoluteIncludePath)}`);
         } else {
            console.error(`    Error reading include file ${path.relative(workspaceRoot, absoluteIncludePath)}:`, error);
         }
        return `/* Error: Could not include file: ${path.basename(absoluteIncludePath)} */`; // Placeholder on error
    }
}

/**
 * Processes a single markdown file, resolving includes.
 */
async function processMarkdownFile(
    relativeFilePath: string, // Relative to sourceDocsDir
    sourceDir: string,
    destinationDir: string // This will now be the 'src' subdirectory
): Promise<void> {
    const sourceFilePath = path.join(sourceDir, relativeFilePath);
    const destFilePath = path.join(destinationDir, relativeFilePath); // Files go into destDir (src)

    try {
        // Ensure destination directory exists (within src)
        await fs.mkdir(path.dirname(destFilePath), { recursive: true });

        const content = await fs.readFile(sourceFilePath, 'utf-8');
        // More robust line splitting: handles LF, CRLF, CR
        const lines = content.split(/\r?\n|\r/);
        const processedLines: string[] = [];

        // Regex that matches lines CONTAINING ONLY the include directive (with optional whitespace)
        // Group 1: Full {{...}} directive
        // Group 2: Path
        // Group 3: Tag (optional)
        const includeLineOnlyRegex = /^\s*({{\s*#include\s+([^{}#:]+)(?::([^{}#]+))?\s*}})\s*$/;

        for (const line of lines) {
            const match = line.match(includeLineOnlyRegex);

            if (match) {
                // This line IS an include directive (and nothing else)
                const includePathRaw = match[2].trim(); // Path is now group 2
                const includeTag = match[3]?.trim(); // Tag is now group 3

                // Resolve path relative to the markdown file's directory
                const markdownFileDir = path.dirname(sourceFilePath);
                const absoluteIncludePath = path.resolve(markdownFileDir, includePathRaw);

                console.log(`  Including in ${relativeFilePath}: ${path.relative(workspaceRoot, absoluteIncludePath)}${includeTag ? ` (tag: ${includeTag})` : ''}`);

                const includedCode = await extractCode(absoluteIncludePath, includeTag);

                if (includedCode !== null) {
                    // Determine language hint from included file extension
                    const ext = path.extname(absoluteIncludePath).toLowerCase();
                    let langHint = '';
                    if (ext === '.rs' || ext === '.rust') langHint = 'rust';
                    else if (ext === '.sw' || ext === '.sway') langHint = 'sway';
                    else if (ext === '.json') langHint = 'json';
                    else if (ext === '.toml') langHint = 'toml';
                    else if (ext === '.text') langHint = 'text';
                    // Add other hints as needed

                    // Add the new code block
                    processedLines.push(`\`\`\`${langHint}`);
                    processedLines.push(includedCode);
                    processedLines.push('```');
                } else {
                    // Push placeholder on error
                    processedLines.push(`<!-- Error: Failed to include '${includePathRaw}'${includeTag ? ` (tag: ${includeTag})` : ''} -->`);
                }
                // Skip the original line since we replaced it entirely
                continue;
            }

            // If the line did not match the include-only pattern, push it unmodified
            processedLines.push(line);
        }
        // Join lines with LF for consistent output
        await fs.writeFile(destFilePath, processedLines.join('\n'));

    } catch (error: any) {
        if (error.code === 'ENOENT') {
             console.error(`Error: Markdown file not found: ${relativeFilePath}`);
        } else {
            console.error(`Error processing file ${relativeFilePath}:`, error);
        }
    }
}

/**
 * Reads the SUMMARY.md file and returns a list of relative markdown file paths.
 */
async function getMarkdownFilesFromSummary(summaryPath: string): Promise<string[]> {
    const summaryContent = await fs.readFile(summaryPath, 'utf-8');
    const markdownLinkRegex = /\[.*?\]\((?!https?:\/\/)([^)#]+\.md)\)/g; // Exclude http(s) links and #anchors
    const files = new Set<string>();
    let match;

    while ((match = markdownLinkRegex.exec(summaryContent)) !== null) {
        const filePath = match[1].trim();
        // Ensure it's not an empty string and is likely a relative path
        if (filePath && !filePath.startsWith('/')) {
             // Normalize path separators for consistency, though path.join handles it
             files.add(filePath.replace(/\\/g, '/'));
        }
    }

    // Add index.md explicitly if it exists in the source directory, as it might not be linked
    const indexPath = 'index.md';
    try {
        await fs.access(path.join(path.dirname(summaryPath), indexPath));
        files.add(indexPath);
         console.log(`Adding index.md explicitly.`);
    } catch {
        console.log(`index.md not found in source, skipping explicit add.`);
    }


    return Array.from(files);
}


/**
 * Main function to generate the book.
 */
async function generateBook() {
    console.log(`Starting book generation...`);
    console.log(`Workspace Root: ${workspaceRoot}`)
    console.log(`Source Docs Dir: ${path.relative(workspaceRoot, sourceDocsDir)}`);
    console.log(`Destination Root Dir: ${path.relative(workspaceRoot, destRootDir)}`); // Log root dir
    console.log(`Destination Content Dir: ${path.relative(workspaceRoot, destDir)}`); // Log src dir

    try {
        // Clean destination *root* directory
        console.log(`Cleaning destination directory: ${path.relative(workspaceRoot, destRootDir)}`);
        await fs.rm(destRootDir, { recursive: true, force: true });
        await fs.mkdir(destDir, { recursive: true }); // Create the 'src' directory

        // --- Check Source Directory ---
        try {
            await fs.access(sourceDocsDir);
            console.log(`Source directory found.`);
        } catch (err) {
             console.error(`Error: Source directory not found at ${sourceDocsDir}`);
             console.error(`Please ensure the 'docs/fuels-rs/docs/src' directory exists relative to your workspace root.`);
             process.exit(1); // Exit if source is missing
        }
        // --- Check Source SUMMARY.md ---
         const summaryPathSource = path.join(sourceDocsDir, summaryFileName);
         try {
             await fs.access(summaryPathSource);
              console.log(`Source ${summaryFileName} found.`);
         } catch (err) {
              console.error(`Error: Source ${summaryFileName} not found at ${summaryPathSource}`);
              process.exit(1); // Exit if summary is missing
         }

        // Copy SUMMARY.md to destination *src* directory
        const summaryPathDest = path.join(destDir, summaryFileName); // Copy to src subdir
        await fs.copyFile(summaryPathSource, summaryPathDest);
        console.log(`Copied ${summaryFileName} to destination src directory.`);

        // Copy book.toml to destination *root* directory
        const bookTomlSourcePath = path.join(sourceBaseDir, 'docs', 'book.toml'); // Path in original submodule structure
        const bookTomlDestPath = path.join(destRootDir, 'book.toml'); // Path in the output root
        try {
            await fs.copyFile(bookTomlSourcePath, bookTomlDestPath);
            console.log(`Copied book.toml to destination root directory.`);
        } catch (err) {
            console.warn(`Warning: Could not copy book.toml from ${bookTomlSourcePath}. This might be needed.`);
        }

        // Get list of files to process from the *source* SUMMARY.md
        const filesToProcess = await getMarkdownFilesFromSummary(summaryPathSource);

        if (filesToProcess.length === 0) {
            console.warn("Warning: No markdown files found linked in SUMMARY.md. Book might be empty.");
             // Copy non-markdown files like images or assets if needed (optional)
             // Example: await copyStaticAssets(sourceDocsDir, destDir);
        } else {
            console.log(`Found ${filesToProcess.length} unique markdown files referenced in ${summaryFileName}.`);
        }


        // Process each markdown file
        console.log("Processing markdown files...");
        for (const relativeFilePath of filesToProcess) {
            console.log(`Processing: ${relativeFilePath}`);
            await processMarkdownFile(relativeFilePath, sourceDocsDir, destDir); // Pass destDir (src subdir)
        }

        console.log('\nBook generation complete.');
        console.log(`Output written to: ${path.relative(workspaceRoot, destRootDir)}`); // Report root dir

    } catch (error) {
        console.error('\nAn unexpected error occurred during book generation:', error);
         process.exit(1);
    }
}

// --- Helper for static assets (optional) ---
// async function copyStaticAssets(source: string, destination: string) {
//     // Implement logic to copy non-markdown files (e.g., images)
//     // You might use a library like 'fs-extra' or recursive fs calls
//     console.log("Copying static assets (implementation needed)...");
// }


generateBook();