import * as fs from 'fs-extra';
import * as path from 'path';

console.log(`Script __dirname: ${__dirname}`); // Debug
const workspaceRoot = path.resolve(__dirname, '..'); // Corrected: Go up only one level
console.log(`Calculated workspaceRoot: ${workspaceRoot}`); // Debug
const sourceDir = path.join(workspaceRoot, 'docs', 'intro');
console.log(`Calculated sourceDir: ${sourceDir}`); // Debug
const outputDir = path.join(workspaceRoot, 'mono-mdbook-final');
console.log(`Calculated outputDir: ${outputDir}`); // Debug
const outputSrcDir = path.join(outputDir, 'intro');
const navJsonPath = path.join(sourceDir, 'nav.json');
console.log(`Calculated navJsonPath: ${navJsonPath}`); // Debug

// Helper function to convert titles like "What is Fuel?" to "what-is-fuel.md"
function titleToFilename(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-') + '.md';
}

// Helper function to get language from file extension
function getLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.rs': return 'rust';
        case '.ts':
        case '.tsx': return 'typescript';
        case '.js':
        case '.jsx': return 'javascript';
        case '.sh':
        case '.bash': return 'bash';
        case '.json': return 'json';
        case '.toml': return 'toml';
        case '.yaml':
        case '.yml': return 'yaml';
        case '.sol': return 'solidity';
        case '.sw': return 'sway'; // Assuming .sw extension for Sway
        case '.md': return 'markdown';
        default: return ''; // Default: let mdbook auto-detect or specify if needed
    }
}

interface CodeReplacement {
    placeholder: string;
    codeFilePath: string;
    commentBlock: string | undefined;
}

async function extractCode(filePath: string, commentBlock?: string): Promise<string | null> {
    try {
        const absoluteFilePath = path.resolve(workspaceRoot, filePath); // Paths in CodeImport seem relative to workspace root
        if (!await fs.pathExists(absoluteFilePath)) {
            console.warn(`Code file not found: ${absoluteFilePath}`);
            return `// Error: Code file not found at ${filePath}`;
        }
        const content = await fs.readFile(absoluteFilePath, 'utf-8');

        if (!commentBlock) {
            return content.trim();
        }

        const blockCommentRegex = new RegExp(
            `/\\*\\s*${commentBlock}:start\\s*\\*/\\s*([\\s\\S]*?)\\s*/\\*\\s*${commentBlock}:end\\s*\\*/`,
            'gs' // Use 's' flag to allow . to match newline, 'g' for global
        );
        const lineCommentRegex = new RegExp(
             `//\\s*${commentBlock}:start\\s*\\r?\\n([\\s\\S]*?)//\\s*${commentBlock}:end`,
            'g'
        );


        let match = blockCommentRegex.exec(content);
        let extractedCode = match ? match[1] : null;

        if (!extractedCode) {
            // Reset lastIndex for lineCommentRegex if blockCommentRegex failed or didn't run
            lineCommentRegex.lastIndex = 0;
             match = lineCommentRegex.exec(content);
             // Check matches carefully
             const lineMatches = content.match(lineCommentRegex);
             if (lineMatches && lineMatches.length > 0) {
                 // Need to re-run exec to get capture groups if match found
                 match = lineCommentRegex.exec(content);
                 extractedCode = match ? match[1] : null;
             }
        }

        if (extractedCode) {
            return extractedCode.trim();
        } else {
            console.warn(`Comment block '${commentBlock}' not found in ${filePath}. Using whole file.`);
             // Fallback to whole file if comment block not found but file exists
            return content.trim();
           // return `// Error: Comment block '${commentBlock}' not found in ${filePath}`;
        }
    } catch (error) {
        console.error(`Error reading or processing code file ${filePath}:`, error);
        return `// Error processing file ${filePath}`;
    }
}


async function processMdxContent(mdxContent: string, mdxFilePath: string): Promise<string> {
    // Remove YAML frontmatter
    let content = mdxContent.replace(/^---[\s\S]*?---/, '').trim();

    // Remove specific MDX tags
    content = content.replace(/<CardSection[\s\S]*?\/>/g, '');
    content = content.replace(/<QuickstartCards\s*\/>/g, '');
    content = content.replace(/<Examples\.\w+\s*\/>/g, '');
    // Remove standalone CodeImport component usage (if any)
    content = content.replace(/^<CodeImport.*?\/>$/gm, '');


    // Process <CodeImport> tags
    const codeImportRegex = /<CodeImport\s+file="([^"]+)"(?:\s+commentBlock="([^"]+)")?\s*\/>/g;
    let match;
    const replacements: CodeReplacement[] = [];

    // Need to handle async replacements properly
    while ((match = codeImportRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const relativeFilePath = match[1];
        const commentBlock = match[2]; // Optional

        // Resolve the file path relative to the workspace root, NOT the MDX file
        const codeFilePath = path.normalize(relativeFilePath); // Use normalize to handle ../ etc.

        replacements.push({
            placeholder: fullMatch,
            codeFilePath,
            commentBlock
        });
    }

    for (const repl of replacements) {
        const code = await extractCode(repl.codeFilePath, repl.commentBlock);
        const lang = getLanguage(repl.codeFilePath);
        const codeBlock = `\`\`\`${lang}\n${code}\n\`\`\``;
        // Be careful with replacing, ensure it doesn't mess up subsequent regex matches
        // Replace only the first occurrence of the placeholder in each iteration
        content = content.replace(repl.placeholder, codeBlock);
    }


    return content;
}

interface NavData {
    menu: string[];
    // Add other potential keys if nav.json structure varies
}

async function generateBook() {
    console.log('Starting mdBook generation for intro...');

    // Ensure output directory exists
    await fs.ensureDir(outputSrcDir);

    // Read nav.json
    let actualNavItems: string[];
    try {
        const navData = await fs.readJson(navJsonPath) as NavData; // Type assertion
        if (navData && Array.isArray(navData.menu)) {
            actualNavItems = navData.menu;
        } else {
            console.error('Invalid nav.json structure. Expected { "menu": [...] }');
            return;
        }
    } catch (error) {
        console.error(`Error reading or parsing ${navJsonPath}:`, error);
        return;
    }

    // Generate SUMMARY.md
    let summaryContent = '# Summary\n\n';
    const pageFiles: { title: string; filename: string }[] = [];

    for (const title of actualNavItems) {
        const filename = titleToFilename(title);
        pageFiles.push({ title, filename });
        summaryContent += `- [${title}](./${filename})\n`;
    }

    await fs.writeFile(path.join(outputSrcDir, 'SUMMARY.md'), summaryContent);
    console.log('Generated SUMMARY.md');

    // Process each MDX file
    for (const { title, filename } of pageFiles) {
        const sourceMdxFilename = filename.replace('.md', '.mdx');
        const sourceMdxPath = path.join(sourceDir, sourceMdxFilename);
        const outputMdPath = path.join(outputSrcDir, filename);

        if (!await fs.pathExists(sourceMdxPath)) {
            console.warn(`Source file not found: ${sourceMdxPath}. Skipping.`);
            continue;
        }

        try {
            const mdxContent = await fs.readFile(sourceMdxPath, 'utf-8');
            const processedContent = await processMdxContent(mdxContent, sourceMdxPath);
            await fs.writeFile(outputMdPath, processedContent);
            console.log(`Processed and wrote ${outputMdPath}`);
        } catch (error) {
            console.error(`Error processing file ${sourceMdxPath}:`, error);
        }
    }

    // Generate book.toml
    const bookTomlContent = `[book]
title = "Fuel Intro"
author = "Fuel Labs"
language = "en"
src = "intro"

[output.html]
default-theme = "dark"
preferred-dark-theme = "dark"
git-repository-url = "https://github.com/FuelLabs/docs-hub"
edit-url-template = "https://github.com/FuelLabs/docs-hub/edit/master/{path}"
site-url = "/intro/" # Adjust site url as needed

[output.html.fold]
enable = true
level = 1

[output.html.playground]
editable = true

[output.html.search]
limit-results = 30
`;
    await fs.writeFile(path.join(outputDir, 'book.toml'), bookTomlContent);
    console.log('Generated book.toml');

    console.log('mdBook generation for intro finished.');
}

generateBook().catch(console.error); 