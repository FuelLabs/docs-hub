import * as fs from 'fs/promises';
import * as path from 'path';

// Define source and output directories
const workspaceRoot = process.cwd(); // Assuming the script runs from the workspace root
const sourceBookDir = path.join(workspaceRoot, '..', 'docs', 'fuel-token-overview', 'docs', 'src');
const outputBookRoot = path.join(workspaceRoot, '..', 'mono-mdbook-final', 'fuel-token-overview-book'); // New root output
const outputBookSrcDir = path.join(outputBookRoot, 'src'); // Specific src dir
const summaryFileName = 'SUMMARY.md';

// Regex to find include directives {{#include path[:anchor]}}
const includeRegex = /\{\{#include\s+([^:]+?)(?::(.+?))?\s*\}\}/g;

// Regex for anchors in source files
const anchorRegex = (anchor: string) => new RegExp(
    `// ANCHOR: ${anchor}\r?\n([\s\S]*?)// ANCHOR_END: ${anchor}`,
    'gm'
);

// Function to ensure directory exists
async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch (error) {
        // Directory does not exist, create it recursively
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Function to read and process a source code file for includes
async function readFileContent(filePath: string, anchor?: string): Promise<string> {
    try {
        const absolutePath = path.resolve(workspaceRoot, filePath); // Resolve path relative to workspace root
        const content = await fs.readFile(absolutePath, 'utf-8');

        if (anchor) {
            const regex = anchorRegex(anchor);
            const match = regex.exec(content);
            if (match && match[1]) {
                // Return the captured group, trimming potential extra newlines
                return match[1].trim();
            } else {
                console.warn(`Warning: Anchor '${anchor}' not found in file '${filePath}'. Including full file.`);
                // Fallback to including the whole file if anchor not found, or handle as error?
                // For now, return whole content, without anchor comments
                 return content.split('\n').filter(line => !line.trim().startsWith('// ANCHOR:') && !line.trim().startsWith('// ANCHOR_END:')).join('\n');
            }
        } else {
             // Include the whole file, removing any anchor comments
             return content.split('\n').filter(line => !line.trim().startsWith('// ANCHOR:') && !line.trim().startsWith('// ANCHOR_END:')).join('\n');
        }
    } catch (error) {
        console.error(`Error reading include file '${filePath}':`, error);
        return `[ERROR: Failed to include '${filePath}']`;
    }
}

// Function to process a single markdown file
async function processMarkdownFile(relativeFilePath: string): Promise<void> {
    const sourceFilePath = path.join(sourceBookDir, relativeFilePath);
    const outputFilePath = path.join(outputBookSrcDir, relativeFilePath);

    console.log(`[processMarkdownFile] Start processing: ${relativeFilePath}`);

    try {
        let content = await fs.readFile(sourceFilePath, 'utf-8');
        let match;
        let processedContent = '';
        let lastIndex = 0;

        while ((match = includeRegex.exec(content)) !== null) {
            processedContent += content.substring(lastIndex, match.index);
            const includePath = match[1].trim();
            const anchor = match[2]?.trim();

            console.log(`Processing include: path='${includePath}', anchor='${anchor}' in file '${relativeFilePath}'`);

            const includedContent = await readFileContent(includePath, anchor);
            const fileExtension = path.extname(includePath).substring(1);

            // Add markdown code block fences
            processedContent += `\`\`\`${fileExtension || ''}\n${includedContent}\n\`\`\`\n`;
            lastIndex = includeRegex.lastIndex;
        }

        processedContent += content.substring(lastIndex); // Add the rest of the file content

        // Ensure output directory exists
        await ensureDir(path.dirname(outputFilePath));
        // Write the processed file
        console.log(`[processMarkdownFile] Attempting to write to: ${outputFilePath}`);
        await fs.writeFile(outputFilePath, processedContent);
        console.log(`[processMarkdownFile] Successfully processed '${relativeFilePath}'`);

    } catch (error) {
        console.error(`[processMarkdownFile] Error processing file '${relativeFilePath}':`, error);
        // Optionally copy the file unprocessed if reading fails? Or just log error.
        // For now, just log the error.
    }
}

// Function to parse SUMMARY.md and get file paths
async function getFilesFromSummary(): Promise<string[]> {
    const summaryPath = path.join(sourceBookDir, summaryFileName);
    const filesToProcess: string[] = [];
    console.log(`Parsing summary file: ${summaryPath}`);
    try {
        const content = await fs.readFile(summaryPath, 'utf-8');
        // Regex to find markdown links like [Title](./path/to/file.md) or [Title](path/to/file.md)
        // It should correctly handle links starting with ./ or just the path
        const linkRegex = /\[.*?\]\((\.\/)?([^)]+\.md)\)/g;
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            const rawFilePath = match[2];
            // Ensure the path is relative and not an external URL
            if (rawFilePath && !rawFilePath.startsWith('http')) {
                // Normalize path separators for consistency
                const normalizedPath = path.normalize(rawFilePath);
                 // Check if the file actually exists relative to sourceBookDir before adding
                try {
                    await fs.access(path.join(sourceBookDir, normalizedPath));
                    if (!filesToProcess.includes(normalizedPath)) {
                         filesToProcess.push(normalizedPath);
                         console.log(`  Found link to process: ${normalizedPath}`);
                    }
                } catch {
                    console.warn(`  Warning: File '${normalizedPath}' linked in SUMMARY.md not found. Skipping.`);
                }
            }
        }

    } catch (error) {
        console.error(`Error reading SUMMARY.md at '${summaryPath}':`, error);
        // If SUMMARY.md cannot be read, we cannot proceed meaningfully
        throw new Error(`Failed to read summary file: ${summaryPath}`);
    }
    return filesToProcess;
}

// Function to create the book.toml file
async function createBookToml(targetDir: string): Promise<void> {
    const bookTomlPath = path.join(targetDir, 'book.toml');
    const content = `[book]\ntitle = "Fuel Token Overview (Generated)"\nauthors = ["Generated Script"]\nlanguage = "en"\nmultilingual = false\nsrc = "src"\n`;
    try {
        await fs.writeFile(bookTomlPath, content);
        console.log(`Created book.toml at ${bookTomlPath}`);
    } catch (error) {
        console.error(`Error creating book.toml at ${bookTomlPath}:`, error);
        throw error; // Rethrow to potentially stop the main process
    }
}

// Main function
async function main() {
    console.log('Starting mdBook generation...');
    console.log(`Source directory: ${sourceBookDir}`);
    console.log(`Output directory: ${outputBookRoot}`);

    // Ensure the base output directory exists
    await ensureDir(outputBookRoot);

    // Create the book.toml file in the root of the output book directory
    await createBookToml(outputBookRoot);

    const files = await getFilesFromSummary();

    if (files.length === 0) {
        console.warn("No markdown files found linked in SUMMARY.md. Exiting.");
        return;
    }

    console.log(`Found ${files.length} files to process from SUMMARY.md:`);
    files.forEach(f => console.log(` - ${f}`));

    // Process each file
    const processingPromises = files.map(file => processMarkdownFile(file));
    await Promise.all(processingPromises);

    // Optionally copy other assets (images, etc.) if needed - TBD
    // Optionally copy/process SUMMARY.md itself - TBD

    console.log(`mdBook generation finished. Output written to: ${outputBookRoot}`);
}

// Run the main function and handle potential errors
main().catch(error => {
    console.error("\nScript execution failed:", error);
    process.exit(1);
});
