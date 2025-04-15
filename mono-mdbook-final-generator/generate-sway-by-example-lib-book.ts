import fs from 'fs-extra';
import path from 'path';

// Restore path definitions
// Base directory of the sway-by-example source docs
const sourceBaseDir = path.resolve(__dirname, '../docs/sway-by-example-lib/docs');
// The 'src' directory within the source docs
const sourceSrcDir = path.join(sourceBaseDir, 'src');
// Base directory where sway-by-example code examples are located
const examplesBaseDir = path.resolve(__dirname, '../docs/sway-by-example-lib/examples');
// Base directory for the processed output book - RENAMED
const targetBaseDir = path.resolve(__dirname, '../mono-mdbook-final/sway-by-example-lib');
// The 'src' directory for the processed output book
const targetSrcDir = path.join(targetBaseDir, 'src');

// Regex definitions (keep only one set)
// Regex to find mdbook include directives: {{#include <path>[:anchor]}}
// This is kept for potential future use but is NOT the primary regex for replacement now.
const includeRegex = /\{\{#include\s+([^}]+)\}\}/g;
// Regex to find markdown links in SUMMARY.md: [Title](path/to/file.md)
const summaryLinkRegex = /\[[^\]]+\]\(([^)]+\.md)\)/g;
// Regex to separate path and anchor in an include directive
const anchorPathRegex = /^(.*):([a-zA-Z0-9_-]+)$/;
// Regex to detect ANCHOR comments in Sway code
const anchorCommentRegex = /^\s*\/\/\s*ANCHOR(_END)?:\s*[a-zA-Z0-9_-]+\s*$/;

// Regex to find ```sway blocks containing ONLY an include directive
// Captures the include directive content (path/anchor) in group 1
// Handles potential leading/trailing whitespace around fences and directive
// Specifically matches newline before the block to avoid consuming inline text
const standaloneIncludeBlockRegex = /(\r?\n|\r)\s*```sway\s*\{\{#include\s+([^}]+)\}\}\s*```\s*/g;

interface Replacement {
  index: number;
  length: number;
  placeholder: string;
  codeBlock: string;
}

/**
 * Extracts a specific code block delineated by ANCHOR comments from a file.
 * @param filePath Absolute path to the code file.
 * @param anchor The anchor name to extract.
 * @returns The extracted code block as a string, or an error message string.
 */
async function extractCodeWithAnchor(filePath: string, anchor: string): Promise<string> {
    if (!await fs.pathExists(filePath)) {
        console.warn(`Warn: Code file not found: ${filePath}`);
        return `// Error: Code file not found: ${path.relative(examplesBaseDir, filePath)}`;
    }
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        const startAnchor = `// ANCHOR: ${anchor}`;
        const endAnchor = `// ANCHOR_END: ${anchor}`;
        let capturing = false;
        const resultLines: string[] = [];

        for (const line of lines) {
            if (line.trim() === startAnchor) {
                capturing = true;
            } else if (line.trim() === endAnchor) {
                capturing = false;
                break; // Stop after finding the end anchor for this specific block
            } else if (capturing) {
                resultLines.push(line);
            }
        }

        if (resultLines.length === 0 && !lines.some(l => l.trim() === startAnchor)) {
             console.warn(`Warn: Anchor '${anchor}' not found in file: ${filePath}`);
             return `// Error: Anchor '${anchor}' not found in ${path.relative(examplesBaseDir, filePath)}`;
        }
        if (resultLines.length === 0 && lines.some(l => l.trim() === startAnchor) && !lines.some(l => l.trim() === endAnchor)) {
             console.warn(`Warn: Anchor '${anchor}' start found but end missing in file: ${filePath}`);
             // Return what was captured, might still be useful
        }


        // Trim leading/trailing empty lines often left by anchors
        let firstLineIdx = 0;
        while(firstLineIdx < resultLines.length && resultLines[firstLineIdx].trim() === '') firstLineIdx++;

        let lastLineIdx = resultLines.length - 1;
        while(lastLineIdx >= firstLineIdx && resultLines[lastLineIdx].trim() === '') lastLineIdx--;


        return resultLines.slice(firstLineIdx, lastLineIdx + 1).join('\n');
    } catch (error) {
         console.error(`Error reading or processing file ${filePath} for anchor ${anchor}:`, error);
         return `// Error processing file ${path.relative(examplesBaseDir, filePath)}`;
    }
}

/**
 * Processes a single Markdown file, replacing includes with code blocks.
 * Pass 1: Handles standalone ```sway {{#include ...}} ``` blocks.
 * Pass 2: Handles any remaining general {{#include ...}} directives.
 * @param sourceFilePath Absolute path to the source Markdown file.
 * @param targetFilePath Absolute path to the target Markdown file destination.
 */
async function processMarkdownFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
    if (!await fs.pathExists(sourceFilePath)) {
        console.warn(`Warn: Markdown file not found: ${sourceFilePath}, skipping.`);
        return;
    }
    console.log(`Processing ${path.relative(sourceBaseDir, sourceFilePath)}...`);

    try {
        let content = await fs.readFile(sourceFilePath, 'utf-8');
        let match;

        // --- PASS 1: Handle standalone ```sway includes ---
        const standaloneReplacements: Replacement[] = [];
        const standaloneFinderRegex = new RegExp(standaloneIncludeBlockRegex.source, 'g');

        while ((match = standaloneFinderRegex.exec(content)) !== null) {
            const fullMatch = match[0];         // The entire ```sway ... ``` block including surrounding whitespace and newline
            const newlinePrefix = match[1];    // The captured newline (\r?\n or \r)
            let includeDirective = match[2].trim(); // The path/anchor part inside {{#include ...}}
            let anchor: string | null = null;

            const anchorMatch = includeDirective.match(anchorPathRegex);
            if (anchorMatch) {
                includeDirective = anchorMatch[1]; // The path part
                anchor = anchorMatch[2];          // The anchor name
            }

            // Resolve the example file path for Sway files
            const mdFileDir = path.dirname(sourceFilePath);
            const absoluteIncludePathForSway = path.resolve(mdFileDir, includeDirective);
            // Make the path relative to the source 'src' dir to find it in the 'examples' dir
            const relativeExamplePathForSway = path.relative(sourceSrcDir, absoluteIncludePathForSway);
            const codeFilePathForSway = path.join(examplesBaseDir, relativeExamplePathForSway);


            let codeContent: string;
            if (anchor) {
                codeContent = await extractCodeWithAnchor(codeFilePathForSway, anchor);
            } else {
                // Include the whole file, filtering ANCHOR comments (assuming .sw here)
                if (!await fs.pathExists(codeFilePathForSway)) {
                    console.warn(`Warn: Sway code file not found: ${codeFilePathForSway} (referenced in ${sourceFilePath})`);
                    codeContent = `// Error: Code file not found: ${path.relative(examplesBaseDir, codeFilePathForSway)}`;
                } else {
                    try {
                        const rawCodeContent = await fs.readFile(codeFilePathForSway, 'utf-8');
                        codeContent = rawCodeContent.split('\n')
                                                  .filter(line => !anchorCommentRegex.test(line))
                                                  .join('\n')
                                                  .replace(/\n$/, '');
                    } catch (readError) {
                         if ((readError as NodeJS.ErrnoException).code === 'EISDIR') {
                             console.error(`Error: Attempted to read a directory as a Sway file: ${codeFilePathForSway} (referenced via ${includeDirective} in ${sourceFilePath})`);
                             codeContent = `// Error: Path points to a directory, not a file: ${includeDirective}`;
                         } else {
                            console.error(`Error reading Sway file ${codeFilePathForSway}:`, readError);
                            codeContent = `// Error reading file ${path.relative(examplesBaseDir, codeFilePathForSway)}`;
                         }
                    }
                }
            }

            standaloneReplacements.push({
                index: match.index,
                length: fullMatch.length,
                placeholder: fullMatch,
                // Add the captured newline back before the code block
                codeBlock: `${newlinePrefix}\`\`\`sway\n${codeContent}\n\`\`\``
            });
        }

        // Apply replacements from Pass 1 before starting Pass 2
        standaloneReplacements.sort((a, b) => b.index - a.index);
        for (const rep of standaloneReplacements) {
            content = content.substring(0, rep.index) + rep.codeBlock + content.substring(rep.index + rep.length);
        }

        // --- PASS 2: Handle any remaining general includes (e.g., Forc.toml) ---
        const generalReplacements: Replacement[] = [];
        const generalIncludeFinderRegex = new RegExp(includeRegex.source, 'g'); // Use the original general include regex

        while ((match = generalIncludeFinderRegex.exec(content)) !== null) {
            const fullMatch = match[0]; // The {{#include ...}} directive itself
            let includeDirective = match[1].trim();

            // Resolve the included file path directly - THIS IS THE FIX
            const mdFileDir = path.dirname(sourceFilePath);
            const codeFilePath = path.resolve(mdFileDir, includeDirective); // Use the resolved absolute path

            let codeContent: string;
            let lang = path.extname(codeFilePath).substring(1); // Get file extension for lang hint

            // Check existence using the correct path
            if (!await fs.pathExists(codeFilePath)) {
                console.warn(`Warn: General include file not found: ${codeFilePath} (referenced in ${sourceFilePath})`);
                // Use the directive path for error reporting if absolute is too long/complex
                codeContent = `// Error: Included file not found: ${includeDirective}`;
                lang = ''; // No language hint if file not found
            } else {
                try {
                    // Read the whole file, don't filter anchors here
                    codeContent = await fs.readFile(codeFilePath, 'utf-8');
                    codeContent = codeContent.replace(/\n$/, ''); // Trim trailing newline
                } catch (readError) {
                    // Check if it was a directory read error
                    if ((readError as NodeJS.ErrnoException).code === 'EISDIR') {
                        console.error(`Error: Attempted to read a directory as a file: ${codeFilePath} (referenced via ${includeDirective} in ${sourceFilePath})`);
                        codeContent = `// Error: Path points to a directory, not a file: ${includeDirective}`;
                    } else {
                       console.error(`Error reading general include file ${codeFilePath}:`, readError);
                       codeContent = `// Error reading included file: ${includeDirective}`;
                    }
                    lang = ''; // Clear lang hint on error
                }
            }

            generalReplacements.push({
                index: match.index,
                length: fullMatch.length,
                placeholder: fullMatch,
                codeBlock: `\`\`\`${lang}\n${codeContent}\n\`\`\``
            });
        }

        // Apply replacements from Pass 2
        generalReplacements.sort((a, b) => b.index - a.index);
        for (const rep of generalReplacements) {
            content = content.substring(0, rep.index) + rep.codeBlock + content.substring(rep.index + rep.length);
        }

        // --- Write the final content ---
        await fs.ensureDir(path.dirname(targetFilePath));
        await fs.writeFile(targetFilePath, content);
    } catch (error) {
        console.error(`Error processing markdown file ${sourceFilePath}:`, error);
        // Optionally write an error placeholder to the target file
        await fs.ensureDir(path.dirname(targetFilePath));
        await fs.writeFile(targetFilePath, `# Error processing file\n\nFailed to process ${path.relative(sourceBaseDir, sourceFilePath)}.\nSee console logs for details.`);
    }
}

/**
 * Main function to orchestrate the book generation process.
 */
async function run(): Promise<void> {
    // Log the calculated paths immediately
    console.log(`Calculated __dirname: ${__dirname}`);
    console.log(`Calculated sourceBaseDir: ${sourceBaseDir}`);
    console.log(`Calculated sourceSrcDir: ${sourceSrcDir}`);
    console.log(`Calculated examplesBaseDir: ${examplesBaseDir}`);
    console.log(`Calculated targetBaseDir: ${targetBaseDir}`);
    console.log(`Calculated targetSrcDir: ${targetSrcDir}`);


    console.log(`Source directory: ${sourceSrcDir}`); // Keep original logs for comparison
    console.log(`Examples directory: ${examplesBaseDir}`);
    console.log(`Target directory: ${targetSrcDir}`);

    // Clean target directory before starting
    console.log(`Cleaning target directory: ${targetBaseDir}`);
    // Add try-catch around fs operations for better debugging
    try {
        await fs.remove(targetBaseDir);
        await fs.ensureDir(targetSrcDir); // ensureDir creates the directory if it doesn't exist, including parents
    } catch (err) {
        console.error(`Error cleaning/creating target directory ${targetBaseDir}:`, err);
        process.exit(1);
    }


    // Copy non-markdown files (images, etc.)
    console.log("Copying non-markdown files...");
    try {
        await fs.copy(sourceSrcDir, targetSrcDir, {
             filter: (src, dest) => {
                 try {
                     // Explicitly log the path being checked by filter
                     // console.log(`Filter checking src: ${src}`);
                     const stats = fs.statSync(src);
                     if (stats.isDirectory()) {
                         return true; // Always copy directories
                     }
                     return !src.endsWith('.md');
                 } catch (statErr) {
                     // Log the specific error during statSync
                     console.error(`Error stating file during copy filter: ${src}`, statErr);
                     // Decide how to handle stat errors, maybe return false to skip?
                     return false; // Skip files that can't be stat'd
                 }
             }
        });
        console.log("Copied non-markdown files.");
    } catch (copyError) {
        console.error(`Error copying files from ${sourceSrcDir} to ${targetSrcDir}:`, copyError);
         // Check if source directory exists explicitly here if copy failed
        if (!await fs.pathExists(sourceSrcDir)) {
            console.error(`Source directory ${sourceSrcDir} confirmed NOT to exist during copy error handling.`);
        } else {
             console.error(`Source directory ${sourceSrcDir} confirmed TO exist during copy error handling.`);
        }
        process.exit(1);
    }


    // Process SUMMARY.md: Copy it and find all linked markdown files
    const summarySourcePath = path.join(sourceSrcDir, 'SUMMARY.md');
    const summaryTargetPath = path.join(targetSrcDir, 'SUMMARY.md');

     if (!await fs.pathExists(summarySourcePath)) {
        console.error(`Error: SUMMARY.md not found at ${summarySourcePath}`);
         // Check if sourceSrcDir exists if SUMMARY.md is not found inside it
        if (!await fs.pathExists(sourceSrcDir)) {
            console.error(`Parent source directory ${sourceSrcDir} also confirmed NOT to exist.`);
        } else {
             console.error(`Parent source directory ${sourceSrcDir} confirmed TO exist, but SUMMARY.md is missing.`);
        }
        process.exit(1);
    }

    const summaryContent = await fs.readFile(summarySourcePath, 'utf-8');
    // Write the original summary content to the target
    await fs.writeFile(summaryTargetPath, summaryContent);
    console.log("Copied SUMMARY.md.");


    const markdownFilesToProcess = new Set<string>(); // Use a Set to automatically handle duplicates
    let summaryMatch;
    while((summaryMatch = summaryLinkRegex.exec(summaryContent)) !== null) {
        const relativeLink = summaryMatch[1];
        // Links in SUMMARY.md are relative to the SUMMARY.md file itself (sourceSrcDir)
        const absoluteMdPath = path.resolve(sourceSrcDir, relativeLink);
        markdownFilesToProcess.add(absoluteMdPath);
    }

     // Add index.md if it exists and wasn't explicitly linked (often the root page)
    const indexMdPath = path.join(sourceSrcDir, 'index.md');
    if (await fs.pathExists(indexMdPath)) {
        markdownFilesToProcess.add(indexMdPath);
    }

    // Convert Set back to Array for processing
    const uniqueMarkdownFiles = Array.from(markdownFilesToProcess);

    // Process all unique markdown files found
    console.log(`Found ${uniqueMarkdownFiles.length} unique markdown files referenced in SUMMARY.md to process...`);
    for (const mdFilePath of uniqueMarkdownFiles) {
        const relativePath = path.relative(sourceSrcDir, mdFilePath);
        const targetFilePath = path.join(targetSrcDir, relativePath);
        await processMarkdownFile(mdFilePath, targetFilePath);
    }


    console.log("\nScript finished successfully.");
    console.log(`Processed book generated in: ${targetBaseDir}`);
}

// Execute the script
run().catch(error => {
    console.error("\nScript failed with an error:", error);
    process.exit(1);
});
// Ensure no stray characters at the end
