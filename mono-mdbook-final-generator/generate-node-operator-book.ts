import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname); // Get directory of the current script
const WORKSPACE_ROOT = path.resolve(SCRIPT_DIR, '..'); // Go up one level to get workspace root

const INPUT_BASE_PATH = path.join(WORKSPACE_ROOT, 'docs/node-operator/docs/src');
const OUTPUT_BASE_PATH = path.join(WORKSPACE_ROOT, 'mono-mdbook-final/node-operator-book');
const OUTPUT_SRC_PATH = path.join(OUTPUT_BASE_PATH, 'src');

const INCLUDE_REGEX = /{{\s*#include\s+([^:]+):([^}\s]+)\s*}}/g;
const ANCHOR_START_REGEX = (anchor: string) => new RegExp(`^\\s*// ANCHOR:\\s*${anchor}\\s*$`, 'm');
const ANCHOR_END_REGEX = (anchor: string) => new RegExp(`^\\s*// ANCHOR_END:\\s*${anchor}\\s*$`, 'm');
const ANCHOR_LINE_REGEX = /^\s*\/\/ ANCHOR(?:_END)?:.*$/m;

// Helper function to determine language hint from file extension
function getLanguageHint(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.rs': return 'rust';
        case '.toml': return 'toml';
        case '.sh': return 'bash'; // Prefer bash over sh
        case '.ts': return 'typescript';
        case '.js': return 'javascript';
        case '.md': return 'markdown';
        case '.json': return 'json';
        case '.yaml':
        case '.yml': return 'yaml';
        // Add more cases as needed
        default: return ''; // No hint
    }
}

// Async function to replace include directives
async function replaceIncludes(content: string, sourceFilePath: string): Promise<string> {
    let processedContent = content;
    const matches = Array.from(content.matchAll(INCLUDE_REGEX));

    for (const match of matches) {
        const fullMatch = match[0];
        const includePath = match[1].trim();
        const anchor = match[2].trim();

        const targetFilePath = path.resolve(WORKSPACE_ROOT, includePath); // Resolve path relative to workspace root
        const langHint = getLanguageHint(targetFilePath);

        try {
            const targetContent = await fs.readFile(targetFilePath, 'utf-8');
            const anchorStart = ANCHOR_START_REGEX(anchor);
            const anchorEnd = ANCHOR_END_REGEX(anchor);

            const startMatch = targetContent.match(anchorStart);
            const endMatch = targetContent.match(anchorEnd);

            if (!startMatch || !endMatch || startMatch.index === undefined || endMatch.index === undefined) {
                console.warn(`WARN: Anchor '${anchor}' not found or incomplete in ${targetFilePath} (referenced by ${sourceFilePath})`);
                // Replace with a warning comment in the markdown
                processedContent = processedContent.replace(fullMatch, `<!-- Include failed: Anchor '${anchor}' not found in ${includePath} -->`);
                continue;
            }

            const startIndex = startMatch.index + startMatch[0].length;
            const endIndex = endMatch.index;

            if (startIndex >= endIndex) {
                 console.warn(`WARN: Anchor '${anchor}' start appears after end in ${targetFilePath} (referenced by ${sourceFilePath})`);
                 processedContent = processedContent.replace(fullMatch, `<!-- Include failed: Anchor '${anchor}' invalid range in ${includePath} -->`);
                 continue;
            }

            let snippet = targetContent.substring(startIndex, endIndex);

            // Remove leading/trailing newlines and the anchor comments themselves
            snippet = snippet.replace(/^\n+|\n+$/g, ''); // Trim leading/trailing newlines
            // snippet = snippet.split('\n').filter(line => !ANCHOR_LINE_REGEX.test(line)).join('\n'); // Remove anchor lines (already done by slicing)

            // Indentation handling: Find minimum indentation of the block and remove it
            const lines = snippet.split('\n');
            let minIndent = Infinity;
            for (const line of lines) {
                if (line.trim().length > 0) { // Only consider non-empty lines
                    const indent = line.match(/^ */)?.[0].length ?? 0;
                    minIndent = Math.min(minIndent, indent);
                }
            }

            if (minIndent > 0 && minIndent !== Infinity) {
                snippet = lines.map(line => line.length > minIndent ? line.substring(minIndent) : line).join('\n');
            }


            const formattedSnippet = `\`\`\`${langHint}\n${snippet}\n\`\`\``;
            processedContent = processedContent.replace(fullMatch, formattedSnippet);

        } catch (error) {
            console.warn(`WARN: Failed to read include file ${targetFilePath} (referenced by ${sourceFilePath}): ${error}`);
            processedContent = processedContent.replace(fullMatch, `<!-- Include failed: Could not read file ${includePath} -->`);
        }
    }

    return processedContent;
}


async function main() {
    console.log('Starting Node Operator mdBook generation...');
    console.log(`Input base: ${INPUT_BASE_PATH}`);
    console.log(`Output base: ${OUTPUT_BASE_PATH}`);

    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_SRC_PATH);

    // --- 1. Process and copy Markdown files ---
    console.log('Processing Markdown files...');
    const mdFiles = await glob('**/*.md', { cwd: INPUT_BASE_PATH });

    for (const relativeFilePath of mdFiles) {
        const sourceFilePath = path.join(INPUT_BASE_PATH, relativeFilePath);
        const destFilePath = path.join(OUTPUT_SRC_PATH, relativeFilePath);

        console.log(`Processing ${relativeFilePath}...`);
        try {
            const content = await fs.readFile(sourceFilePath, 'utf-8');
            const processedContent = await replaceIncludes(content, sourceFilePath);

            await fs.ensureDir(path.dirname(destFilePath));
            await fs.writeFile(destFilePath, processedContent, 'utf-8');
        } catch (error) {
            console.error(`Error processing file ${sourceFilePath}:`, error);
        }
    }
    console.log('Markdown processing complete.');

    // --- 2. Copy non-Markdown files (e.g., images) ---
    console.log('Copying non-Markdown assets...');
    const otherFiles = await glob('**/*!(*.md)', { cwd: INPUT_BASE_PATH, nodir: true });

    for (const relativeFilePath of otherFiles) {
         const sourceFilePath = path.join(INPUT_BASE_PATH, relativeFilePath);
         const destFilePath = path.join(OUTPUT_SRC_PATH, relativeFilePath);
         console.log(`Copying ${relativeFilePath}...`);
         try {
            await fs.ensureDir(path.dirname(destFilePath));
            await fs.copy(sourceFilePath, destFilePath);
         } catch (error) {
             console.error(`Error copying file ${sourceFilePath}:`, error);
         }
    }
    console.log('Asset copying complete.');


    // --- 3. Create book.toml ---
    console.log('Creating book.toml...');
    const bookTomlContent = `[book]
title = "Fuel Node Operator (Generated)"
authors = ["Fuel Labs"]
language = "en"
multilingual = false
src = "src"

[output.html]
theme = "theme"
`;
    const themeDirPath = path.join(OUTPUT_BASE_PATH, 'theme');
    const bookTomlPath = path.join(OUTPUT_BASE_PATH, 'book.toml');

    // Create an empty theme dir (mdbook requires it if specified)
    await fs.ensureDir(themeDirPath);
    await fs.writeFile(bookTomlPath, bookTomlContent, 'utf-8');
    console.log('book.toml created.');


    console.log('Node Operator mdBook generation finished successfully!');
}

main().catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
}); 