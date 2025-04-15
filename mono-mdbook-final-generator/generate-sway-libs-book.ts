import fs from 'fs/promises';
import path from 'path';

const workspaceRoot = path.resolve(__dirname, '..'); // Assuming the script is in mono-mdbook-final-generator
const swayLibsBookSrc = path.join(workspaceRoot, 'docs/sway-libs/docs/book/src');
const outputDir = path.join(workspaceRoot, 'mono-mdbook-final/sway-libs');
const outputSrcDir = path.join(outputDir, 'src');

const includeRegex = /{{#include\s+([^:]+):([^}]+)}}/g;
const anchorRegex = (anchor: string) =>
  new RegExp(
    `//\\s*ANCHOR:\\s*${anchor}\\s*\\n([\\s\\S]*?)\\n\\s*//\\s*ANCHOR_END:\\s*${anchor}`,
    'm'
  );

async function extractCodeSnippet(filePath: string, anchor: string): Promise<string | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const match = content.match(anchorRegex(anchor));
    if (match && match[1]) {
        // Trim leading/trailing whitespace/newlines from the extracted block
        // and ensure consistent newline characters
        return match[1].trim().replace(/\\r\\n/g, '\n');
    }
    console.warn(`Warning: Anchor "${anchor}" not found in file: ${filePath}`);
    return null;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
        console.warn(`Warning: Included file not found: ${filePath}`);
    } else {
        console.error(`Error reading file ${filePath}:`, error);
    }
    return null;
  }
}

async function processMarkdownFile(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {
    let content = await fs.readFile(inputFilePath, 'utf-8');
    const replacements: { directive: string; code: string }[] = [];

    // Use matchAll to find all include directives
    for (const match of content.matchAll(includeRegex)) {
        const originalDirective = match[0];
        const relativeIncludePath = match[1].trim();
        const anchor = match[2].trim();

        // Resolve the path relative to the *markdown file's directory*
        const markdownFileDir = path.dirname(inputFilePath);
        const targetSwayFilePath = path.resolve(markdownFileDir, relativeIncludePath);

        const snippet = await extractCodeSnippet(targetSwayFilePath, anchor);

        if (snippet !== null) {
            replacements.push({
                directive: originalDirective,
                code: `${snippet}`,
            });
        } else {
             replacements.push({
                directive: originalDirective,
                 // Keep the original directive if snippet extraction fails, maybe add a comment
                code: `<!-- Failed to include ${relativeIncludePath}:${anchor} -->\n${originalDirective}`,
             });
             console.error(`Failed to extract snippet for ${relativeIncludePath}:${anchor} referenced in ${inputFilePath}`);
        }
    }

    // Apply replacements sequentially
    for (const { directive, code } of replacements) {
      content = content.replace(directive, code);
    }

    await fs.writeFile(outputFilePath, content, 'utf-8');
    // console.log(`Processed: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error processing Markdown file ${inputFilePath}:`, error);
  }
}

async function processDirectory(currentInputDir: string, currentOutputDir: string): Promise<void> {
  try {
    await fs.mkdir(currentOutputDir, { recursive: true });
    const entries = await fs.readdir(currentInputDir, { withFileTypes: true });

    for (const entry of entries) {
      const inputPath = path.join(currentInputDir, entry.name);
      const outputPath = path.join(currentOutputDir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(inputPath, outputPath);
      } else if (entry.isFile()) {
        if (path.extname(entry.name) === '.md') {
          await processMarkdownFile(inputPath, outputPath);
        } else {
          // Copy other files directly (like SUMMARY.md, images, etc.)
          await fs.copyFile(inputPath, outputPath);
          // console.log(`Copied: ${outputPath}`);
        }
      }
    }
  } catch (error) {
      console.error(`Error processing directory ${currentInputDir}:`, error);
  }
}

async function main() {
  console.log(`Starting processing of Sway Libs book: ${swayLibsBookSrc}`);
  console.log(`Outputting to: ${outputSrcDir}`);

  try {
    // Clean output directory before starting
    await fs.rm(outputDir, { recursive: true, force: true });
    console.log(`Cleaned output directory: ${outputDir}`);

    await processDirectory(swayLibsBookSrc, outputSrcDir);

    // Copy the book.toml file if it exists
    const bookTomlPath = path.join(workspaceRoot, 'docs/sway-libs/docs/book/book.toml');
    const outputBookTomlPath = path.join(outputDir, 'book.toml');
    try {
        await fs.copyFile(bookTomlPath, outputBookTomlPath);
        console.log(`Copied book.toml to ${outputBookTomlPath}`);
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(`Error copying book.toml:`, error);
        } else {
            console.log(`book.toml not found at ${bookTomlPath}, skipping copy.`);
        }
    }


    console.log('Sway Libs book processing finished successfully.');
  } catch (error) {
    console.error('Error during book processing:', error);
    process.exit(1);
  }
}

main();

// Helper type for async replace (not strictly needed here as we collect replacements first)
declare global {
    interface String {
        replaceAsync(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => Promise<string>): Promise<string>;
    }
}

String.prototype.replaceAsync = async function (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => Promise<string>): Promise<string> {
    const promises: Promise<string>[] = [];
    this.replace(searchValue, (substring, ...args) => {
        promises.push(replacer(substring, ...args));
        return ''; // Placeholder, we rebuild the string later
    });
    const replacements = await Promise.all(promises);
    let i = 0;
    return this.replace(searchValue, () => replacements[i++]);
};