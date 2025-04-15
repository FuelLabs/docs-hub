import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

// Base directory of the sway-standards submodule relative to the project root
const swayStandardsBaseDir = path.resolve(process.cwd(), '../docs/sway-standards');
// Source mdBook content directory within the submodule
const inputDocsDir = path.join(swayStandardsBaseDir, 'docs');
const inputSrcDir = path.join(inputDocsDir, 'src');
// Output directory for the generated book relative to the project root
const outputBaseDir = path.resolve(process.cwd(), '../mono-mdbook-final/sway-standards-book');
const outputSrcDir = path.join(outputBaseDir, 'src');

// Corrected regex - removed unnecessary escapes
const includeRegex = /^{{\s*#include\s+([^:}]+)(?::(.+))?\s*}}$/gm;
// Corrected anchor regexes
const anchorRegexStart = (anchor: string) => new RegExp(`//\\s*ANCHOR:\\s*${anchor}\\s*`);
const anchorRegexEnd = (anchor: string) => new RegExp(`//\\s*ANCHOR_END:\\s*${anchor}\\s*`);
// Corrected anchor removal regex
const anchorCommentRegex = /\/\/\s*ANCHOR(?:_END)?:\s*.*$/gm;

async function processMarkdownFile(filePath: string, relativePath: string): Promise<void> {
    console.log(`Processing Markdown: ${relativePath}`);
    const content = await fs.readFile(filePath, 'utf-8');
    let processedContent = content;
    // const currentMdDir = path.dirname(filePath); // Directory of the current markdown file - Not needed for new logic

    const matches = Array.from(content.matchAll(includeRegex));

    for (const match of matches) {
        const [fullMatch, includePathRaw, anchor] = match;
        const includePath = includePathRaw.trim();
        // ***** CORRECTED PATH RESOLUTION *****
        // Resolve the include path relative to the *inputDocsDir* (e.g., docs/sway-standards/docs/),
        // as paths like '../examples/...' seem to be relative to this base.
        const codeFilePath = path.resolve(inputDocsDir, includePath);

        console.log(`  Including: ${codeFilePath}${anchor ? ` (Anchor: ${anchor.trim()})` : ''} (From: ${includePathRaw})`);

        try {
            if (!await fs.pathExists(codeFilePath)) {
                 console.warn(`  WARNING: Code file not found: ${codeFilePath}`);
                 console.warn(`    (Searched relative to: ${inputDocsDir})`);
                 // Add check for parent directory if still not found
                 const maybeCorrectedPath = path.resolve(swayStandardsBaseDir, includePath.replace('../', '')); // Previous attempt logic
                  if (await fs.pathExists(maybeCorrectedPath)) {
                       console.warn(`    NOTE: File *was* found at alternate path: ${maybeCorrectedPath}. Check include syntax in source MD.`);
                  }

                processedContent = processedContent.replace(fullMatch, `\`\`\`\nERROR: File not found: ${includePath}\n(Resolved path: ${codeFilePath})\n\`\`\``);
                continue;
            }

            const codeContent = await fs.readFile(codeFilePath, 'utf-8');
            let snippet = codeContent;

            if (anchor) {
                const trimmedAnchor = anchor.trim();
                const startRegex = anchorRegexStart(trimmedAnchor);
                const endRegex = anchorRegexEnd(trimmedAnchor);
                const lines = codeContent.split('\n');
                let startIndex = -1;
                let endIndex = -1;

                for (let i = 0; i < lines.length; i++) {
                    if (startRegex.test(lines[i])) {
                        startIndex = i + 1;
                    } else if (endRegex.test(lines[i]) && startIndex !== -1) {
                        endIndex = i;
                        break;
                    }
                }

                if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                    snippet = lines.slice(startIndex, endIndex).join('\n');
                } else {
                    console.warn(`  WARNING: Anchor '${trimmedAnchor}' not found or invalid in ${codeFilePath}`);
                    snippet = `\`\`\`\nERROR: Anchor '${trimmedAnchor}' not found or invalid in ${includePath}\n(File: ${codeFilePath})\n\`\`\``;
                     processedContent = processedContent.replace(fullMatch, snippet);
                     continue;
                }
            }

            snippet = snippet.replace(anchorCommentRegex, '').trimEnd();

            const fileExtension = path.extname(codeFilePath).substring(1);
            let lang = fileExtension;
             if (fileExtension === 'sw') lang = 'sway';
             else if (fileExtension === 'rs') lang = 'rust';
             else if (fileExtension === 'ts') lang = 'typescript';
             else if (fileExtension === 'js') lang = 'javascript';
             else if (fileExtension === 'toml') lang = 'toml';
             else if (fileExtension === 'sh' || fileExtension === 'bash') lang = 'bash';

            const codeBlock = `${snippet}`;
            processedContent = processedContent.replace(fullMatch, codeBlock);

        } catch (error: any) {
            console.error(`  ERROR processing include ${includePath} from ${filePath}: ${error.message || error}`);
            processedContent = processedContent.replace(fullMatch, `\`\`\`\nERROR: Could not process include: ${includePath}\n(File: ${codeFilePath})\n${error.message || error}\n\`\`\``);
        }
    }

    const outputFilePath = path.join(outputSrcDir, relativePath);
    await fs.ensureDir(path.dirname(outputFilePath));
    await fs.writeFile(outputFilePath, processedContent);
}

async function copyAndProcessDirectory(source: string, target: string): Promise<void> {
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);
        const relativePath = path.relative(inputSrcDir, sourcePath);

        if (entry.isDirectory()) {
            if (entry.name === '.git') continue;
            await fs.ensureDir(targetPath);
            await copyAndProcessDirectory(sourcePath, targetPath);
        } else {
             if (sourcePath.includes('/.git/') || sourcePath.endsWith('/.git')) continue;

            if (path.extname(entry.name) === '.md') {
                await processMarkdownFile(sourcePath, relativePath);
            } else {
                await fs.copy(sourcePath, targetPath);
            }
        }
    }
}

async function createBookToml(): Promise<void> {
     const bookTomlPath = path.join(outputBaseDir, 'book.toml');
     console.log(`Creating ${bookTomlPath}...`);

    const themeDir = path.join(inputDocsDir, 'theme');
    const outputThemeDir = path.join(outputBaseDir, 'theme');
    let themeExists = false;

    if (await fs.pathExists(themeDir)) {
        try {
             const stats = await fs.stat(themeDir);
             if (stats.isDirectory()) {
                 const files = await fs.readdir(themeDir);
                 if (files.length > 0) {
                     console.log(`Copying theme directory from ${themeDir} to ${outputThemeDir}...`);
                     await fs.copy(themeDir, outputThemeDir);
                     themeExists = true;
                 } else {
                      console.log(`Source theme directory found but is empty, using default mdbook theme. Path: ${themeDir}`);
                 }
             } else {
                 console.log(`Source theme path exists but is not a directory, using default mdbook theme. Path: ${themeDir}`);
             }
        } catch (err: any) {
             console.error(`Error checking or copying theme directory from ${themeDir}: ${err.message}. Using default theme.`);
        }
    } else {
        console.log(`Optional theme directory not found, using default mdbook theme. Path: ${themeDir}`);
    }

    const bookTomlContent = `[book]
title = "Sway Standards (Generated)"
authors = ["Fuel Labs"]
language = "en"
multilingual = false
src = "src"

[output.html]
${themeExists ? 'theme = "theme"' : '# theme = "theme" (Source theme not found or empty, using default)'}
# Add other configurations from original book.toml if needed
# default-theme = "light"
# preferred-dark-theme = "navy"
# git-repository-url = "https://github.com/FuelLabs/sway-standards"
# git-repository-icon = "fa-github"
`;

    await fs.writeFile(bookTomlPath, bookTomlContent);


    // Assets path relative to sway-standards root, output inside src
    const assetsDir = path.join(swayStandardsBaseDir, 'assets');
    const outputAssetsDir = path.join(outputSrcDir, 'assets');
     if (await fs.pathExists(assetsDir)) {
         console.log(`Copying assets directory from ${assetsDir} to ${outputAssetsDir}...`);
         await fs.ensureDir(outputAssetsDir);
         await fs.copy(assetsDir, outputAssetsDir);
    } else {
        console.log("Optional assets directory not found at", assetsDir);
    }
}

async function run(): Promise<void> {
    console.log('--- Starting mdBook generation for Sway Standards ---');
    console.log(`Sway Standards Base: ${swayStandardsBaseDir}`);
    console.log(`Input mdBook Src: ${inputSrcDir}`);
    console.log(`Output directory: ${outputBaseDir}`);


    try {
        console.log('\nCleaning output directory...');
        await fs.remove(outputBaseDir);
        await fs.ensureDir(outputSrcDir);

        console.log('\nProcessing source files and copying includes...');
        await copyAndProcessDirectory(inputSrcDir, outputSrcDir);

        console.log('\nCreating book.toml and copying theme/assets...');
        await createBookToml();

        console.log('\n--- mdBook generation complete ---');
        console.log('Output written to:', outputBaseDir);

        console.log(`\nRunning mdbook build in ${outputBaseDir}...`);
        try {
            execSync('mdbook build', { cwd: outputBaseDir, stdio: 'inherit' });
            console.log('\nMdbook build successful.');
        } catch (buildError: any) {
             console.error('\n--- ERROR during mdbook build ---');
             console.error(`Failed to build book in ${outputBaseDir}`);
             throw buildError;
        }

    } catch (error: any) {
        console.error('\n--- ERROR during script execution ---');
         if (error.stderr || error.stdout) {
             console.error("Command failed:", error.cmd);
             console.error("STDERR:", error.stderr?.toString());
             console.error("STDOUT:", error.stdout?.toString());
         } else {
             console.error(error.message || error);
         }
        process.exit(1);
    }
}

run().catch(error => {
    console.error("--- Uncaught Script Failure ---");
    console.error(error);
    process.exit(1);
}); 