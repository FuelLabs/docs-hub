import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';

// Determine paths relative to the script file's location
const SCRIPT_DIR = __dirname;
const WORKSPACE_ROOT = path.resolve(SCRIPT_DIR, '..'); // Go up one level from mono-mdbook-final-generator

const SOURCE_DOCS_PATH = path.join(WORKSPACE_ROOT, 'docs/fuel-graphql-docs/docs');
const OUTPUT_BOOK_PATH = path.join(WORKSPACE_ROOT, 'mono-mdbook-final/fuel-graphql-book');
const OUTPUT_SRC_PATH = path.join(OUTPUT_BOOK_PATH, 'src');
const NAV_JSON_PATH = path.join(WORKSPACE_ROOT, 'docs/fuel-graphql-docs/src/nav.json');
const CODE_IMPORT_REGEX = /<CodeImport\s+file="([^"]+)"(?:\s+commentBlock="([^"]+)")?\s*\/>/g;
const COMMENT_BLOCK_START_REGEX = /\/\*\s*commentBlock:start\s*\*\//;
const COMMENT_BLOCK_END_REGEX = /\/\*\s*commentBlock:end\s*\*\//;
const GQL_CODE_EXAMPLE_PAIR_REGEX = /<GQLExamples\.(\w+)\s*\/>\s*(<CodeExamples\s+[^>]*\/>)/gs;
const CODE_EXAMPLE_ATTR_REGEX = /(\w+)=\"([^\"]+)\"/g;
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n^---\s*$/m;

// Manual mapping for nav items where the filename doesn't match the sanitized title
const fileNameOverrides: Record<string, string> = {
    "Schema & Type System": "apis-explained.mdx" // Key: nav.json string, Value: actual filename
    // Add other overrides here if needed
};

interface NavStructure {
    menu: (string | Record<string, string[]>)[];
    [key: string]: (string | Record<string, string[]>)[]; // For nested sections like "reference"
}

interface Frontmatter {
    title?: string;
    category?: string;
}

interface PageInfo {
    sourcePath: string;
    outputPath: string;
    summaryPath: string;
    title: string;
    category?: string; // The category from frontmatter (e.g., "Reference")
    navKey?: string; // The corresponding key in nav.json (e.g., "reference")
}

// Function to sanitize names for file paths
function sanitizeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/&/g, 'and') // Replace & with 'and'
        .replace(/[^a-z0-9\s-]/g, '') // Remove remaining special characters except spaces and hyphens
        .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

// Function to determine code language from file extension
function getLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.rs': return 'rust';
        case '.ts': return 'typescript';
        case '.js': return 'javascript';
        case '.json': return 'json';
        case '.graphql': return 'graphql';
        case '.toml': return 'toml';
        case '.sh': return 'bash';
        case '.md': return 'markdown';
        default: return ''; // Default to no language specified
    }
}

// Function to convert camelCase/PascalCase to UPPER_SNAKE_CASE
function toUpperSnakeCase(str: string): string {
    if (!str) return '';
    return str
        // Add underscore before capital letters (but not at the start)
        .replace(/[A-Z]/g, letter => `_${letter}`)
        // Remove leading underscore if present (from initial capital)
        .replace(/^_/, '')
        // Convert to uppercase
        .toUpperCase();
}

// Function to parse frontmatter from mdx content
function parseFrontmatter(content: string): Frontmatter | null {
    const match = content.match(FRONTMATTER_REGEX);
    if (match && match[1]) {
        try {
            // Trim the captured YAML string before parsing
            return yaml.load(match[1].trim()) as Frontmatter;
        } catch (e) {
            console.error('Error parsing YAML frontmatter:', e);
            return null;
        }
    } else {
        // Try finding title using simple regex as fallback for files missing --- fences
        const titleMatch = content.match(/^#\\s*(.*)\\s*$/m);
        if (titleMatch && titleMatch[1]) {
            console.warn(`Missing frontmatter fences, using first H1 as title: ${titleMatch[1]}`);
            return { title: titleMatch[1] };
        }
    }
    return null;
}

// Updated function to process a single markdown file, now returns title if found
async function processMarkdownFile(sourceMdPath: string, outputMdPath: string): Promise<string | null> {
    if (!await fs.pathExists(sourceMdPath)) {
        console.warn(`Source file not found, creating empty file: ${sourceMdPath} -> ${outputMdPath}`);
        await fs.ensureFile(outputMdPath);
        const fallbackTitle = path.basename(outputMdPath, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        await fs.writeFile(outputMdPath, `# ${fallbackTitle}\n\nContent pending.`);
        return fallbackTitle; // Return fallback title for summary
    }

    let content = await fs.readFile(sourceMdPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const pageTitle = frontmatter?.title || path.basename(outputMdPath, '.md'); // Use frontmatter title or filename

    // Remove YAML frontmatter from content before processing
    content = content.replace(FRONTMATTER_REGEX, '');

    const sourceDir = path.dirname(sourceMdPath);
    let match;
    let codeImportReplacements: { tag: string; codeBlock: string }[] = [];
    let gqlExampleReplacements: { tagPair: string; codeBlock: string }[] = [];

    // --- Pass 1: Find <CodeImport> tags --- 
    CODE_IMPORT_REGEX.lastIndex = 0; // Reset state before use
    while ((match = CODE_IMPORT_REGEX.exec(content)) !== null) {
        const [tag, relativeCodePath, commentBlockName] = match;
        const codeFilePath = path.resolve(sourceDir, relativeCodePath); // Resolve relative to the MD file

        if (!await fs.pathExists(codeFilePath)) {
            console.error(`Code file not found: ${codeFilePath} (referenced in ${sourceMdPath})`);
            codeImportReplacements.push({ tag, codeBlock: `\`\`\`\nError: Code file not found at ${relativeCodePath}\n\`\`\`` });
            continue;
        }

        let codeContent = await fs.readFile(codeFilePath, 'utf-8');
        let extractedCode = codeContent; // Default to full content

        if (commentBlockName) {
            // More specific regex if commentBlockName is provided
            // Need to double-escape backslashes for RegExp constructor
            const startRegex = new RegExp(`\/\*\s*commentBlock:start:${commentBlockName}\s*\*\/`);
            const endRegex = new RegExp(`\/\*\s*commentBlock:end\s*\*\/`); // General end marker
            const startIndex = codeContent.search(startRegex);
            // Find the *next* end marker after the start marker
            const endIndex = codeContent.indexOf('/* commentBlock:end */', startIndex);

            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                // Extract from the end of the start marker to the beginning of the end marker
                const startMarkerMatch = codeContent.substring(startIndex).match(startRegex);
                const startMarkerLength = startMarkerMatch ? startMarkerMatch[0].length : 0;
                extractedCode = codeContent.substring(startIndex + startMarkerLength, endIndex);
                 // Trim leading/trailing whitespace potentially including newlines around markers
                 extractedCode = extractedCode.trim();

            } else {
                 // Fallback to general markers if specific name not found
                 const genericStartIndex = codeContent.search(COMMENT_BLOCK_START_REGEX);
                 const genericEndIndex = codeContent.indexOf('/* commentBlock:end */', genericStartIndex);

                 if (genericStartIndex !== -1 && genericEndIndex !== -1 && genericEndIndex > genericStartIndex) {
                    console.warn(`Specific comment block '${commentBlockName}' not found in ${codeFilePath}, using first available block.`);
                    const startMarkerMatch = codeContent.substring(genericStartIndex).match(COMMENT_BLOCK_START_REGEX);
                    const startMarkerLength = startMarkerMatch ? startMarkerMatch[0].length : 0;
                    extractedCode = codeContent.substring(genericStartIndex + startMarkerLength, genericEndIndex);
                    // Trim leading/trailing whitespace potentially including newlines around markers
                    extractedCode = extractedCode.trim();
                 } else {
                    console.warn(`Comment block '${commentBlockName}' or any block not found in ${codeFilePath}, using full file content.`);
                    // Keep extractedCode as full codeContent
                 }
            }
        } else {
             // If no commentBlock specified, check if *any* comment block exists
             const genericStartIndex = codeContent.search(COMMENT_BLOCK_START_REGEX);
             const genericEndIndex = codeContent.indexOf('/* commentBlock:end */', genericStartIndex);
             if (genericStartIndex !== -1 && genericEndIndex !== -1 && genericEndIndex > genericStartIndex) {
                 console.warn(`No comment block specified in ${sourceMdPath} for ${relativeCodePath}, but blocks found. Using full file content.`);
                 // Keep extractedCode as full codeContent - user specifically asked for full file if no block
             } else {
                 // No blocks specified, no blocks found - use full content
                 extractedCode = codeContent;
             }
        }

        // Clean the extracted code: remove start/end markers if they were part of the initial grab
        // (e.g., if using full file content or if substring logic was imperfect)
        extractedCode = extractedCode.replace(COMMENT_BLOCK_START_REGEX, '').replace(COMMENT_BLOCK_END_REGEX, '').trim();

        const language = getLanguage(codeFilePath);
        const codeBlock = `\`\`\`${language}\\n${extractedCode}\\n\`\`\``;
        codeImportReplacements.push({ tag, codeBlock });
    }

    // Reset regex lastIndex if needed (though new regex instances are used below)
    CODE_IMPORT_REGEX.lastIndex = 0;

    // --- Pass 2: Find <GQLExamples> / <CodeExamples> pairs --- 
    GQL_CODE_EXAMPLE_PAIR_REGEX.lastIndex = 0; // Reset state before use
    while ((match = GQL_CODE_EXAMPLE_PAIR_REGEX.exec(content)) !== null) {
        const [tagPair, exampleName, codeExamplesTag] = match;

        // Parse attributes from CodeExamples tag
        const attrs: Record<string, string> = {};
        let attrMatch;
        while ((attrMatch = CODE_EXAMPLE_ATTR_REGEX.exec(codeExamplesTag)) !== null) {
            attrs[attrMatch[1]] = attrMatch[2];
        }
        CODE_EXAMPLE_ATTR_REGEX.lastIndex = 0; // Reset regex state

        const relativeCodePath = attrs.file;
        let replacementCodeBlock = `\`\`\`\nError: Could not process example ${exampleName}\n\`\`\``; // Initialize here
        let combinedCodeBlock = ""; // Store combined results for TS, Apollo, Urql

        if (!relativeCodePath) {
            console.error(`Missing 'file' attribute in ${codeExamplesTag} for example ${exampleName}`);
            replacementCodeBlock = `\`\`\`\nError: Missing 'file' attribute in CodeExamples tag for ${exampleName}\n\`\`\``;
            gqlExampleReplacements.push({ tagPair, codeBlock: replacementCodeBlock });
            continue;
        }
        const codeFilePath = path.resolve(sourceDir, relativeCodePath);

        // Convert extracted name (e.g., LatestTransactions) to upper snake case
        const markerBase = toUpperSnakeCase(exampleName); // e.g., LATEST_TRANSACTIONS
        const startMarkerQuery = `// ${markerBase}_QUERY`;
        const startMarkerArgs = `// ${markerBase}_ARGS`; // Added args marker
        if (!await fs.pathExists(codeFilePath)) {
            console.error(`Code file for GQL Example not found: ${codeFilePath} (referenced in ${sourceMdPath}`);
            replacementCodeBlock = `\`\`\`\nError: Code file not found at ${relativeCodePath}\n\`\`\``;
        } else {
            try {
                const codeContent = await fs.readFile(codeFilePath, 'utf-8');
                const results: Record<string, string> = {}; // Store code/errors for ts, apollo, urql

                for (const type of ['ts', 'apollo', 'urql']) {
                    const testCaseAttrName = `${type}_testCase`;
                    const testCaseName = attrs[testCaseAttrName];

                    if (!testCaseName) {
                        // This type of example is not specified in the tag
                        continue;
                    }

                    let foundCode: string | null = null;
                    let errorMsg: string | null = null;

                    // Find the line containing the test definition
                    const testDefinitionLine = `test('${testCaseName}'`;
                    const testLineIndex = codeContent.indexOf(testDefinitionLine);

                    if (testLineIndex === -1) {
                        errorMsg = `Test case '${testCaseName}' not found.`;
                    } else {
                        // Find the start of the async function block after the test line
                        const functionStartIndex = codeContent.indexOf('async () => {', testLineIndex);
                        if (functionStartIndex === -1) {
                            errorMsg = `Could not find 'async () => {' for test case '${testCaseName}'.`;
                        } else {
                            // Extract the body of that function block
                            const bodyStartIndex = codeContent.indexOf('{', functionStartIndex) + 1;
                            let braceDepth = 1;
                            let bodyEndIndex = bodyStartIndex;
                            while (bodyEndIndex < codeContent.length && braceDepth > 0) {
                                // Basic brace matching, ignore braces in strings/comments
                                if (codeContent[bodyEndIndex] === '{') braceDepth++;
                                else if (codeContent[bodyEndIndex] === '}') braceDepth--;
                                bodyEndIndex++;
                            }

                            if (braceDepth === 0) {
                                const functionBody = codeContent.substring(bodyStartIndex, bodyEndIndex - 1).trim();
                                // Verify *at least* the QUERY marker exists within this extracted body
                                if (functionBody.includes(startMarkerQuery)) {
                                    foundCode = functionBody;
                                } else {
                                    errorMsg = `Marker ('${startMarkerQuery}') not found within the extracted body for test case '${testCaseName}'.`;
                                }
                            } else {
                                errorMsg = `Could not find matching closing brace for test case '${testCaseName}'.`;
                            }
                        }
                    }

                    if (errorMsg) {
                        console.warn(`${errorMsg} (File: ${codeFilePath})`);
                        results[type] = `\`\`\`\nError: ${errorMsg}\n\`\`\``;
                    } else if (foundCode !== null) {
                        const language = getLanguage(codeFilePath);
                        results[type] = `\`\`\`${language}\n${foundCode}\n\`\`\``;
                    }
                } // End loop through types
                // Combine the results into a single markdown block
                let combinedOutput = "";
                if (results.ts) {
                    combinedOutput += `### TypeScript Example\n\n${results.ts}\n\n`;
                }
                if (results.apollo) {
                    combinedOutput += `### Apollo Client Example\n\n${results.apollo}\n\n`;
                }
                if (results.urql) {
                    combinedOutput += `### urql Example\n\n${results.urql}\n\n`;
                }
                replacementCodeBlock = combinedOutput.trim() || `\`\`\`\nError: No valid examples found for ${exampleName}\n\`\`\``;
            } catch (err) {
                console.error(`Error processing code file ${codeFilePath} for example ${exampleName}:`, err);
                replacementCodeBlock = `\`\`\`\nError: Could not process code file ${relativeCodePath}\n\`\`\``;
            }
        }
        gqlExampleReplacements.push({ tagPair, codeBlock: replacementCodeBlock });
    }
    GQL_CODE_EXAMPLE_PAIR_REGEX.lastIndex = 0; // Reset regex state

    // Apply replacements
    for (const { tagPair, codeBlock } of gqlExampleReplacements) {
        content = content.replace(tagPair, codeBlock);
    }
    for (const { tag, codeBlock } of codeImportReplacements) {
        content = content.replace(tag, codeBlock);
    }

    await fs.ensureDir(path.dirname(outputMdPath));
    await fs.writeFile(outputMdPath, content);
    return pageTitle; // Return the determined page title
}

// Main generation function
async function generateFuelGraphqlBook(): Promise<void> {
    console.log('Starting Fuel GraphQL mdBook generation...');
    console.log(`Source Path: ${SOURCE_DOCS_PATH}`);
    console.log(`Output Path: ${OUTPUT_BOOK_PATH}`);

    // 1. Clean and create output directory
    await fs.emptyDir(OUTPUT_BOOK_PATH);
    await fs.ensureDir(OUTPUT_SRC_PATH);

    // 2. Read nav.json for structure/order guide
    if (!await fs.pathExists(NAV_JSON_PATH)) {
        console.error(`Error: Navigation file not found at ${NAV_JSON_PATH}`);
        process.exit(1);
    }
    const navData: NavStructure = await fs.readJson(NAV_JSON_PATH);

    // 3. Find all .mdx files and parse frontmatter
    const allPages: Record<string, PageInfo> = {}; // Store page info keyed by source path
    const files = glob.sync(`${SOURCE_DOCS_PATH}/**/*.mdx`, { nodir: true });

    console.log(`Found ${files.length} .mdx files to process...`);

    for (const sourcePath of files) {
        const content = await fs.readFile(sourcePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);
        if (!frontmatter || !frontmatter.title) {
            console.warn(`Skipping file due to missing title in frontmatter (or fallback H1): ${sourcePath}`);
            continue;
        }

        const title = frontmatter.title;
        const category = frontmatter.category; // e.g., "Reference", "How To Use GraphQL"
        const relativeSourceDir = path.dirname(path.relative(SOURCE_DOCS_PATH, sourcePath)); // e.g., "reference", "how-to-use-graphql"
        const outputFileName = `${sanitizeName(title)}.md`; // Use sanitized title for output filename
        const outputPath = path.join(OUTPUT_SRC_PATH, relativeSourceDir, outputFileName);
        const summaryPath = path.relative(OUTPUT_SRC_PATH, outputPath);

        allPages[sourcePath] = {
            sourcePath,
            outputPath,
            summaryPath,
            title,
            category,
            navKey: category ? sanitizeName(category) : undefined // Attempt to link category to navKey
        };
    }

    // 4. Build SUMMARY.md using nav.json as ordering guide
    const summaryLines = ['# Summary', ''];

    if (!navData.menu) {
        console.error("Error: 'menu' key not found in nav.json");
        process.exit(1);
    }

    const processedPaths = new Set<string>(); // Track processed files to avoid duplicates

    for (const menuItem of navData.menu) {
        if (typeof menuItem === 'string') {
            const categoryName = menuItem; // e.g., "Reference", "Overview"
            const navKey = sanitizeName(categoryName); // e.g., "reference", "overview"

            // Find pages matching this category/menu item
            const pagesInCategory = Object.values(allPages).filter(p => 
                (p.category === categoryName) || // Match explicit category
                (!p.category && p.title === categoryName && categoryName !== "Reference") // Match title if no category, avoid matching 'Reference' title here
            );
            
            // Explicitly find the page whose category is 'Reference' if the menuItem is 'Reference'
            if (categoryName === "Reference") {
                pagesInCategory.push(...Object.values(allPages).filter(p => p.category === categoryName));
            }
            // Remove duplicates if any introduced
            const uniquePagesInCategory = [...new Map(pagesInCategory.map(p => [p.sourcePath, p])).values()];

            if (uniquePagesInCategory.length === 0) {
                console.warn(`No source files found for nav menu item/category: ${categoryName}`);
                // Optionally, create a placeholder section/page?
                continue; // Skip this nav item
            }

            const sectionItems = navData[navKey];

            if (sectionItems && Array.isArray(sectionItems)) {
                // --- It\'s a Section with defined sub-items in nav.json --- 
                summaryLines.push(`# ${categoryName}`);
                
                // Process the potential index page first (title matches category) but don\'t add to summary list
                const indexPage = uniquePagesInCategory.find(p => p.title === categoryName);
                if (indexPage) {
                    await processMarkdownFile(indexPage.sourcePath, indexPage.outputPath);
                    processedPaths.add(indexPage.sourcePath);
                }

                // Use nav.json order for sub-items
                for (const subItemTitle of sectionItems) {
                    // Ensure subItemTitle is a string before processing
                    if (typeof subItemTitle !== 'string') {
                        console.warn(`Skipping non-string item found in nav.json section '${categoryName}': ${JSON.stringify(subItemTitle)}`);
                        continue;
                    }
                    // Find the page matching the subItemTitle *within this category*.
                    // Exclude the index page from being listed again.
                    const foundPage = uniquePagesInCategory.find(p => p.title === subItemTitle && p.title !== categoryName);
                    if (foundPage) {
                        summaryLines.push(`  - [${foundPage.title}](${foundPage.summaryPath})`);
                        await processMarkdownFile(foundPage.sourcePath, foundPage.outputPath);
                        processedPaths.add(foundPage.sourcePath);
                    } else {
                        // Only create placeholder if the subItemTitle doesn't match the categoryName (index page handled above)
                        if (subItemTitle !== categoryName) {
                            console.warn(`File for title "${subItemTitle}" (under category "${categoryName}") not found, referenced in nav.json.`);
                            // Create placeholder?
                            const sanitizedSubItem = sanitizeName(subItemTitle);
                            // Ensure placeholder goes into correct subdir based on navKey
                            const placeholderOutputPath = path.join(OUTPUT_SRC_PATH, navKey, `${sanitizedSubItem}.md`); 
                            const placeholderSummaryPath = path.relative(OUTPUT_SRC_PATH, placeholderOutputPath);
                            summaryLines.push(`  - [${subItemTitle} (Pending)](${placeholderSummaryPath})`);
                            await fs.ensureFile(placeholderOutputPath);
                            await fs.writeFile(placeholderOutputPath, `# ${subItemTitle}\\n\\nContent pending based on nav.json.`);
                        }
                    }
                }
                 // Process any remaining pages in this category not explicitly listed in nav.json's section array?
                 // (and not the index page)
                 const remainingInCategory = uniquePagesInCategory.filter(
                     p => !processedPaths.has(p.sourcePath) && p.title !== categoryName
                 );
                 if(remainingInCategory.length > 0) {
                     console.warn(`Found ${remainingInCategory.length} file(s) in category \'${categoryName}\' not listed in nav.json section array. Adding alphabetically.`);
                     remainingInCategory.sort((a, b) => a.title.localeCompare(b.title));
                     for (const page of remainingInCategory) {
                         summaryLines.push(`  - [${page.title}](${page.summaryPath})`);
                         await processMarkdownFile(page.sourcePath, page.outputPath);
                         processedPaths.add(page.sourcePath);
                     }
                 }

            } else {
                // --- Standalone File or Section without specific sub-item order in nav.json --- 
                // Find the potential index page
                const indexPage = uniquePagesInCategory.find(p => p.title === categoryName);
                const otherPages = uniquePagesInCategory.filter(p => p.title !== categoryName);
                
                if (indexPage && otherPages.length === 0) {
                     // Only an index page exists, treat as standalone file link
                     summaryLines.push(`- [${indexPage.title}](${indexPage.summaryPath})`);
                     await processMarkdownFile(indexPage.sourcePath, indexPage.outputPath);
                     processedPaths.add(indexPage.sourcePath);
                } else {
                    // Treat as a section (either index + others, or just others)
                    summaryLines.push(`# ${categoryName}`);
                    // Process index page content if it exists
                    if (indexPage) {
                         await processMarkdownFile(indexPage.sourcePath, indexPage.outputPath);
                         processedPaths.add(indexPage.sourcePath);
                    }
                    // List and process other pages alphabetically
                    otherPages.sort((a, b) => a.title.localeCompare(b.title));
                    for (const page of otherPages) {
                         summaryLines.push(`  - [${page.title}](${page.summaryPath})`);
                         await processMarkdownFile(page.sourcePath, page.outputPath);
                         processedPaths.add(page.sourcePath);
                    }
                }
            }
        } else {
             console.warn(`Ignoring non-string item found directly in nav.menu: ${JSON.stringify(menuItem)}`);
        }
    }

    // Process any remaining files found by glob but not matched/ordered by nav.json?
    const remainingFiles = Object.values(allPages).filter(p => !processedPaths.has(p.sourcePath));
    if (remainingFiles.length > 0) {
        console.warn(`Found ${remainingFiles.length} file(s) not referenced or ordered by nav.json. Adding to end.`);
        summaryLines.push('# Uncategorized');
        remainingFiles.sort((a, b) => a.title.localeCompare(b.title));
        for (const page of remainingFiles) {
            summaryLines.push(`- [${page.title}](${page.summaryPath})`);
            await processMarkdownFile(page.sourcePath, page.outputPath); // Process content
        }
    }

    // 5. Write SUMMARY.md
    const summaryContent = summaryLines.join('\n');
    await fs.writeFile(path.join(OUTPUT_SRC_PATH, 'SUMMARY.md'), summaryContent);

    // 6. Create book.toml
    const bookTomlContent = `[book]
title = \"Fuel GraphQL Docs (Generated)\"\nauthor = \"Fuel Labs\"\ndescription = \"Generated mdBook for Fuel GraphQL documentation.\"\nlanguage = \"en\"\n\n[output.html]\n# theme = \"theme\" # Theme not found, using default\ndefault-theme = \"fuel-dark\"\npreferred-dark-theme = \"fuel-dark\"\n# git-repository-url = \"https://github.com/FuelLabs/docs-hub\" # Optional: Add repo link\n\n[output.html.fold]\nenable = true\nlevel = 0\n\n[output.html.print]\nenable = false\n`;
    await fs.writeFile(path.join(OUTPUT_BOOK_PATH, 'book.toml'), bookTomlContent);

    // 7. Copy theme files if they exist (assuming a theme structure)
    const sourceThemePath = path.join(SOURCE_DOCS_PATH, '../../theme');
    const outputThemePath = path.join(OUTPUT_BOOK_PATH, 'theme');
    if (await fs.pathExists(sourceThemePath)) {
        try {
            await fs.copy(sourceThemePath, outputThemePath);
            console.log('Copied theme files.');
        } catch (err) {
            console.error('Error copying theme files:', err);
        }
    } else {
        console.warn(`Theme directory not found at ${sourceThemePath}, skipping theme copy.`);
    }

    console.log('Fuel GraphQL mdBook generation complete!');
    console.log(`Output available at: ${OUTPUT_BOOK_PATH}`);
}

generateFuelGraphqlBook().catch(error => {
    console.error("Error during book generation:", error);
    process.exit(1);
}); 