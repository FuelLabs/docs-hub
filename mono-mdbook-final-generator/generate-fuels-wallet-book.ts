import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob'; // Import glob

const CWD = process.cwd();
// Adjust the base path to the repository root if necessary
// Check if CWD ends with the generator directory name
const scriptDirName = path.basename(path.resolve(__dirname)); // Get the name of the directory the script is in
const isRunningInGeneratorDir = CWD.endsWith(scriptDirName);
const REPO_ROOT = isRunningInGeneratorDir ? path.resolve(CWD, '../') : CWD;

const FUELS_WALLET_DOCS_PATH = path.join(REPO_ROOT, 'docs/fuels-wallet/packages/docs');
const NAV_JSON_PATH = path.join(FUELS_WALLET_DOCS_PATH, 'src/nav.json');
const DOCS_INPUT_BASE_PATH = path.join(FUELS_WALLET_DOCS_PATH, 'docs'); // Base path for input docs

// Output directly into mono-mdbook-final/fuels-wallet
const OUTPUT_DIR = path.join(REPO_ROOT, 'mono-mdbook-final/fuels-wallet');
const SUMMARY_MD_PATH = path.join(OUTPUT_DIR, 'SUMMARY.md');

interface NavStructure {
  menu: string[];
  dev: string[];
  contributing: string[];
  [key: string]: string[]; // Add index signature
}

interface DocInfo {
  filePath: string;
  title: string;
  category: string | null; // Category might be missing
  sectionKey: string | null; // Derived key ('menu', 'dev', 'contributing')
  sanitizedFilename: string;
}

// Map frontmatter category to nav.json keys
const categoryToSectionKeyMap: { [key: string]: string } = {
  '': 'menu', // Assume empty category is top-level menu
  'For Developers': 'dev',
  'Contributing': 'contributing',
  // Add other mappings if needed
};

// Helper function to parse frontmatter (simple regex approach)
function parseFrontmatter(content: string): { title?: string; category?: string } {
  const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!frontmatterMatch) {
    return {};
  }
  const frontmatterContent = frontmatterMatch[1];
  const titleMatch = frontmatterContent.match(/^title:\s*(.*)$/m);
  const categoryMatch = frontmatterContent.match(/^category:\s*(.*)$/m);

  return {
    title: titleMatch ? titleMatch[1].trim().replace(/^"|"$/g, '') : undefined,
    category: categoryMatch ? categoryMatch[1].trim().replace(/^"|"$/g, '') : undefined,
  };
}

// Helper function to sanitize filenames (lowercase, replace space with hyphen)
function sanitizeFilename(title: string): string {
  // Keep basic sanitization, ensure it handles various characters
  return title.toLowerCase()
            .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
            .replace(/[^a-z0-9-\/.]/g, '') // Remove invalid characters except hyphens, slashes, dots
            .replace(/-+/g, '-') // Collapse multiple hyphens
            .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
         + '.md';
}

// Helper function to extract code snippets
async function extractCodeSnippet(filePath: string, commentBlock?: string): Promise<string> {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`   [CodeImport Warn] Code file not found: ${filePath}`);
      return `// Code file not found: ${filePath}`;
    }
    const content = await fs.readFile(filePath, 'utf-8');
    const cleanContent = content.replace(/\r\n/g, '\n'); // Normalize line endings

    if (!commentBlock) {
      // If no commentBlock, return the whole file, removing any potential markers
      return cleanContent.replace(/\/\*\s*\w+:(start|end)\s*\*\//g, '').trim();
    }

    // Use more robust regex for markers, allowing flexibility in spacing
    const startMarkerRegex = new RegExp(`\\/\\*\\s*${commentBlock}:start\\s*\\*\\/`);
    const endMarkerRegex = new RegExp(`\\/\\*\\s*${commentBlock}:end\\s*\\*\\/`);

    const startIndexMatch = cleanContent.match(startMarkerRegex);
    const endIndexMatch = cleanContent.match(endMarkerRegex);

    if (!startIndexMatch || !endIndexMatch || startIndexMatch.index === undefined || endIndexMatch.index === undefined) {
      console.warn(`   [CodeImport Warn] Comment block '${commentBlock}' start or end marker not found in ${filePath}. Returning full content.`);
      // Return the whole file if markers aren't found, removing any potential markers
      return cleanContent.replace(/\/\*\s*\w+:(start|end)\s*\*\//g, '').trim();
    }

    const startIndex = startIndexMatch.index + startIndexMatch[0].length;
    const endIndex = endIndexMatch.index;

    if (startIndex >= endIndex) {
        console.warn(`   [CodeImport Warn] Comment block '${commentBlock}' start marker appears after end marker in ${filePath}. Returning full content.`);
        return cleanContent.replace(/\/\*\s*\w+:(start|end)\s*\*\//g, '').trim();
    }

    // Extract the content between markers, excluding the markers themselves
    const snippet = cleanContent.substring(startIndex, endIndex).trim();
    // Also clean any *other* markers within the snippet if they exist
    return snippet.replace(/\/\*\s*\w+:(start|end)\s*\*\//g, '').trim();
  } catch (error) {
     console.error(`   [CodeImport Error] Error processing code file ${filePath}:`, error);
     return `// Error reading code file: ${filePath}`;
  }
}

// Helper function to get language from file extension
function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.ts': return 'typescript';
    case '.tsx': return 'typescript'; // Often used with React components
    case '.js': return 'javascript';
    case '.jsx': return 'javascript';
    case '.rs': return 'rust';
    case '.sh': return 'bash';
    case '.json': return 'json';
    case '.toml': return 'toml';
    case '.md': return 'markdown';
    case '.mdx': return 'markdown'; // Treat mdx as markdown for code blocks
    case '.sol': return 'solidity';
    case '.sw': return 'sway';
    case '.sway': return 'sway';
    case '.yml': return 'yaml';
    case '.yaml': return 'yaml';
    default: return ''; // Default to no language specified for ```
  }
}

// Main function
async function generateBook() {
  console.log('Starting Fuels Wallet book generation (frontmatter-driven)...');

  // --- Step 1: Scan for all MDX files and parse frontmatter ---
  console.log(`Scanning for MDX files in ${DOCS_INPUT_BASE_PATH}...`);
  const mdxFiles = await glob(`${DOCS_INPUT_BASE_PATH}/**/*.mdx`);
  const docInfos: DocInfo[] = [];

  for (const filePath of mdxFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const { title, category } = parseFrontmatter(content);

    if (!title) {
      console.warn(`  - Skipping ${filePath}: Missing 'title' in frontmatter.`);
      continue;
    }

    const sectionKey = categoryToSectionKeyMap[category ?? ''] || null;
    // if (!sectionKey) {
    //   console.warn(`  - Skipping ${filePath}: Unknown category '${category}'.`);
    //   continue;
    // }

    docInfos.push({
      filePath,
      title,
      category: category ?? null,
      sectionKey, // Store the derived section key
      sanitizedFilename: sanitizeFilename(title), // Generate filename from frontmatter title
    });
  }
  console.log(`Found ${docInfos.length} processable MDX files.`);

  // --- Step 2: Read nav.json for ordering ---
  if (!fs.existsSync(NAV_JSON_PATH)) {
    console.error(`Error: Navigation file not found at ${NAV_JSON_PATH}`);
    process.exit(1);
  }
  const navStructure: NavStructure = await fs.readJson(NAV_JSON_PATH);

  // --- Step 3: Ensure output directory exists and is clean ---
  await fs.ensureDir(OUTPUT_DIR);
  await fs.emptyDir(OUTPUT_DIR);

  // --- Step 4: Generate SUMMARY.md and process files based on nav.json order ---
  let summaryContent = `# Summary\n\n`; // Start SUMMARY.md
  let processedFilesCount = 0;

  // Define the order of sections based on common practice or nav.json structure
  const sectionOrder = ['menu', 'dev', 'contributing'];

  for (const sectionKey of sectionOrder) {
    const navTitles = navStructure[sectionKey];
    if (!navTitles) continue; // Skip if section doesn't exist in nav.json

    // Determine section title for SUMMARY.md
    let sectionSummaryTitle = '';
    if (sectionKey === 'dev') sectionSummaryTitle = 'For Developers';
    if (sectionKey === 'contributing') sectionSummaryTitle = 'Contributing';

    if (sectionSummaryTitle) {
        summaryContent += `## ${sectionSummaryTitle}\n\n`;
    } else {
        summaryContent += `## Fuels Wallet\n\n`; // Top level section title
    }


    for (const navTitle of navTitles) {
      // Find the corresponding DocInfo based on the frontmatter title matching the navTitle
      const docInfo = docInfos.find(d => d.title === navTitle && d.sectionKey === sectionKey);

      if (!docInfo) {
        // Check if it's a known section header listed in nav.json (like 'For Developers')
        const isKnownHeader = (sectionKey === 'menu' && (navTitle === 'For Developers' || navTitle === 'Contributing'));
        if (!isKnownHeader) {
             console.warn(`[Nav Warn] Entry "${navTitle}" in nav.json section "${sectionKey}" not found in MDX files by title/category match. Skipping summary entry.`);
        }
        continue; // Skip this nav entry
      }

      console.log(`Processing "${docInfo.title}": ${docInfo.filePath}...`);
      let content = await fs.readFile(docInfo.filePath, 'utf-8');
      content = content.replace(/\r\n/g, '\n'); // Normalize line endings

      // --- Step 4a: Handle <CodeImport> (existing logic) ---
      const codeImportRegex = /<CodeImport\s+file="([^"]+)"(?:\s+commentBlock="([^"]+)")?\s*\/?>/g;
      
      // Define interface for replacement info
      interface ReplacementInfo {
          originalTag: string;
          language: string;
          codeSnippetPromise: Promise<string>;
      }
      const replacements: ReplacementInfo[] = []; // Explicitly type the array

      let match;
      while ((match = codeImportRegex.exec(content)) !== null) {
        const originalTag = match[0];
        const relativeCodePath = match[1];
        const commentBlock = match[2];
        const codeFilePath = path.resolve(path.dirname(docInfo.filePath), relativeCodePath);
        const codeSnippetPromise = extractCodeSnippet(codeFilePath, commentBlock);
        const language = getLanguage(codeFilePath);
        replacements.push({ originalTag, language, codeSnippetPromise });
      }
      const resolvedSnippets = await Promise.all(replacements.map(r => r.codeSnippetPromise));
      for (let i = 0; i < replacements.length; i++) {
        const { originalTag, language } = replacements[i];
        const codeSnippet = resolvedSnippets[i];
        const markdownCodeBlock = `\`\`\`${language}\n${codeSnippet}\n\`\`\``;
        content = content.replace(originalTag, markdownCodeBlock);
      }

      // --- Step 4b: Remove <Examples.* /> tags (existing logic) ---
      const examplesRegex = /<Examples\.\w+\s*\/?>/g;
      content = content.replace(examplesRegex, '');

      // --- Step 4c: Remove MDX frontmatter (existing logic) ---
      const frontmatterRegex = /^---\s*[\s\S]*?^---\s*(\r?\n)?/m;
      content = content.replace(frontmatterRegex, '');

      // --- Step 4d: Remove specific lines like category (optional) ---
      content = content.replace(/^category:.*\n?/im, '');

      // --- Step 4e: Trim leading/trailing whitespace ---
      content = content.trim();

      // --- Step 4f: Write the processed content ---
      const outputFilePath = path.join(OUTPUT_DIR, docInfo.sanitizedFilename);
      await fs.writeFile(outputFilePath, content);
      console.log(`   -> Wrote ${outputFilePath}`);
      processedFilesCount++;

      // --- Step 4g: Add entry to summary ---
      // Indent based on section level? mdbook uses nesting.
      const indent = (sectionKey === 'menu') ? '' : '  '; // Basic indent for sub-sections
      summaryContent += `${indent}*   [${docInfo.title}](${docInfo.sanitizedFilename})\n`;
    }
    summaryContent += '\n'; // Add newline after each section's items
  }

  // --- Step 5: Write SUMMARY.md ---
  // Check if SUMMARY.md exists (it shouldn't as we clear the dir, but robust check)
    // Ensure the directory exists
    await fs.ensureDir(path.dirname(SUMMARY_MD_PATH));
    // Write the new summary content
    await fs.writeFile(SUMMARY_MD_PATH, summaryContent.trim() + '\n');

  console.log(`\nFuels Wallet book generation finished. Processed ${processedFilesCount} files.`);
  console.log(`Output written to: ${OUTPUT_DIR}`);
  console.log(`Summary updated: ${SUMMARY_MD_PATH}`);

  // --- Step 6: Create book.toml if it doesn't exist ---
  const bookTomlPath = path.join(OUTPUT_DIR, 'book.toml');
  if (!fs.existsSync(bookTomlPath)) {
    console.log('Creating book.toml...');
    const bookTomlContent = `[book]\ntitle = "Fuels Wallet Book (Generated)"\nsrc = "."\n`;
    await fs.writeFile(bookTomlPath, bookTomlContent);
  } else {
    console.log('book.toml already exists.');
  }
}

generateBook().catch(error => {
  console.error('Error generating Fuels Wallet book:', error);
  process.exit(1);
}); 