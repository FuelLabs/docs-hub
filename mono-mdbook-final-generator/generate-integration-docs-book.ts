import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

// Get the workspace root relative to the current working directory
// Assuming the script is run from mono-mdbook-final-generator
const currentWorkingDir = process.cwd(); // Should be /Users/calldelegation/final/docs-hub/mono-mdbook-final-generator
const workspaceRoot = path.resolve(currentWorkingDir, '..'); // Go up one level to /Users/calldelegation/final/docs-hub

const integrationDocsBaseDir = path.join(workspaceRoot, 'docs/integration-docs'); // Keep base for potential root files if needed later
const sourceDir = path.join(integrationDocsBaseDir, 'docs'); // Point to the nested docs directory
const outputBaseDir = path.join(workspaceRoot, 'mono-mdbook-final');
const outputDir = path.join(outputBaseDir, 'integration-docs');

const anchorStartRegex = /\/\/\s*ANCHOR:\s*(?<name>\w+)/;
const anchorEndRegex = /\/\/\s*ANCHOR_END:\s*(?<name>\w+)/;
const includeRegex = /\{\{#include\s+([^:}]+)(?::(?<anchor>\w+))?\s*\}\}/g;

async function processInclude(
  match: string,
  filePath: string,
  anchorName: string | undefined,
  markdownFilePath: string
): Promise<string> {
  // Resolve include paths relative to the *original* sourceDir, not the output dir
  const includeFilePath = path.resolve(sourceDir, filePath.trim());
  const markdownDir = path.dirname(markdownFilePath);

  try {
    const fileContent = await fs.readFile(includeFilePath, 'utf-8');
    let relevantContent = fileContent;
    let lang = path.extname(includeFilePath).substring(1);
    if (lang === 'sw') {
      lang = 'rust'; // Use rust highlighting for Sway
    } else if (lang === 'ts') {
        lang = 'typescript';
    } else if (lang === 'md') {
        lang = ''; // No code block for markdown includes
    }

    if (anchorName) {
      const lines = fileContent.split('\n');
      let inAnchor = false;
      const anchorLines: string[] = [];
      let foundAnchor = false;

      for (const line of lines) {
        const startMatch = line.match(anchorStartRegex);
        const endMatch = line.match(anchorEndRegex);

        if (startMatch && startMatch.groups?.name === anchorName) {
          inAnchor = true;
          foundAnchor = true;
        } else if (endMatch && endMatch.groups?.name === anchorName) {
          inAnchor = false;
          break; // Exit after finding the end anchor
        } else if (inAnchor) {
          anchorLines.push(line);
        }
      }

      if (!foundAnchor) {
        console.warn(`WARN: Anchor '${anchorName}' not found in ${includeFilePath}. Including entire file.`);
      } else if (anchorLines.length > 0) {
          relevantContent = anchorLines.join('\n');
      } else {
          relevantContent = ''; // Anchor found but empty
      }
    }

    // Remove ANCHOR comments from the final content
    relevantContent = relevantContent
      .split('\n')
      .filter(line => !anchorStartRegex.test(line) && !anchorEndRegex.test(line))
      .join('\n');

    if (lang) {
        return `\`\`\`${lang}\n${relevantContent}\n\`\`\``;
    } else {
        // For markdown includes, process nested includes recursively
        return await processMarkdownFileContent(relevantContent, includeFilePath);
    }

  } catch (error) {
    console.error(`ERROR: Failed to read include file ${includeFilePath} referenced in ${markdownFilePath}:`, error);
    return `\`\`\`\nERROR: Could not include file: ${filePath}\n\`\`\``; // Return error message in code block
  }
}

async function processMarkdownFileContent(content: string, markdownFilePath: string): Promise<string> {
    let processedContent = content;
    const matches = Array.from(content.matchAll(includeRegex));

    for (const match of matches) {
        const [fullMatch, includePath, anchorName] = match;
        const replacement = await processInclude(fullMatch, includePath.trim(), anchorName, markdownFilePath);
        processedContent = processedContent.replace(fullMatch, replacement);
    }
    return processedContent;
}


async function processMarkdownFile(filePath: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const processedContent = await processMarkdownFileContent(content, filePath);
    await fs.writeFile(filePath, processedContent, 'utf-8');
    console.log(`Processed: ${path.relative(outputDir, filePath)}`);
  } catch (error) {
    console.error(`ERROR: Failed to process markdown file ${filePath}:`, error);
  }
}

async function generateBook(): Promise<void> {
  console.log('Starting integration-docs book generation...');

  try {
    await fs.ensureDir(outputDir);

    // Paths are now relative to the nested 'docs' directory
    const sourceSrcDir = path.join(sourceDir, 'src');
    const sourceBookToml = path.join(sourceDir, 'book.toml'); // book.toml should be inside docs/integration-docs/docs
    const destSrcDir = path.join(outputDir, 'src');
    const destBookToml = path.join(outputDir, 'book.toml');

    console.log(`Checking for src directory: ${sourceSrcDir}...`);
    if (!(await fs.pathExists(sourceSrcDir))) {
        console.error(`ERROR: src directory not found in ${sourceDir}. Cannot proceed.`);
        process.exit(1);
    }

    console.log(`Copying ${sourceSrcDir} to ${destSrcDir}...`);
    await fs.copy(sourceSrcDir, destSrcDir, { overwrite: true });

    console.log(`Checking for book.toml: ${sourceBookToml}...`);
    if (await fs.pathExists(sourceBookToml)) {
        console.log(`Copying ${sourceBookToml} to ${destBookToml}...`);
        await fs.copy(sourceBookToml, destBookToml, { overwrite: true });
    } else {
        console.warn(`WARN: book.toml not found in ${sourceDir}. Creating a default one.`);
        const defaultTomlContent = `[book]\ntitle = "Integration Docs"\nsrc = "src"`;
        await fs.writeFile(destBookToml, defaultTomlContent, 'utf-8');
        console.log(`Created default book.toml in ${destBookToml}`);
    }

    // Find all markdown files in the destination src directory
    const markdownFiles = await glob(`${destSrcDir}/**/*.md`, { absolute: true });

    console.log(`Found ${markdownFiles.length} markdown files to process...`);

    // Process each markdown file
    for (const file of markdownFiles) {
      await processMarkdownFile(file);
    }

    console.log('integration-docs book generation completed successfully.');

  } catch (error) {
    console.error('Error during integration-docs book generation:', error);
    process.exit(1);
  }
}

generateBook(); 