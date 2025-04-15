import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

// Define directories
const workspaceRoot = path.resolve(__dirname, '..'); // Assumes script is in a subdir of workspace root
const bookRootDir = path.join(workspaceRoot, 'mono-mdbook-final/fuels-ts');
const sourceDir = path.join(workspaceRoot, 'docs/fuels-ts/apps/docs/src');
const outputDir = path.join(bookRootDir, 'src');
// --- Define base directory for code snippets relative paths ---
// This is where paths like `@/path/to/snippet.ts` will resolve from
const codeSourceDir = sourceDir;
// --- End base directory definition ---
const vitePressConfigPath = path.join(workspaceRoot, 'docs/fuels-ts/apps/docs/.vitepress/config.ts');

// Regex to match <<< @/path/to/file#region{options}
// Original (buggy): const snippetDirectiveRegex = /^<<<\\s*@([^{>]+)(?:#([^\\s{>]+))?(?:{([^}]+)})?/;
// Fixed: Stop path capture before # or {
const snippetDirectiveRegex = /^<<<\s*@([^#{\s>]+)(?:#([^\s{>]+))?(?:{([^}]+)})?/;

function extractCodePath(match: RegExpMatchArray): string {
  return match[1];
}

async function processFile(filePath: string): Promise<void> {
  const relativePath = path.relative(sourceDir, filePath);
  const outputPath = path.join(outputDir, relativePath);
  await fs.ensureDir(path.dirname(outputPath));

  let content = '';
  try {
      content = await fs.readFile(filePath, 'utf-8');
  } catch (readError) {
      console.error(`ERROR: Failed to read markdown file ${filePath}:`, readError);
      return; // Skip this file if it cannot be read
  }

  const lines = content.split('\n');
  const processedLines: string[] = [];

  for (const line of lines) {
    const match = line.match(snippetDirectiveRegex);
    if (match) {
      const codePathRaw = match[1].trim();
      const region = match[2] ? match[2].trim() : null;
      const langHint = match[3] ? match[3].trim() : null; // Extract language hint

      // --- Path Resolution Logic ---
      let codeFilePath: string;
      const markdownFileDir = path.dirname(filePath);

      // Special handling for specific files we know need to be fixed
      if (codePathRaw === '/../../docs/sway/configurable-pin/src/main.sw') {
        codeFilePath = path.resolve(outputDir, 'sway/configurable-pin/src/main.sw');
        console.log(`[Debug] Special handling for known file: ${codePathRaw} => ${codeFilePath}`);
      }
      // Handle all Sway files with path patterns like /../../docs/sway/project-name/src/main.sw or /../../docs/sway/project-name/src/lib.sw
      else if (codePathRaw.startsWith('/../../docs/sway/')) {
        // Extract the Sway project name from the path
        const parts = codePathRaw.split('/');
        // The project name should be at index 5 if the pattern is /../../docs/sway/PROJECT_NAME/...
        const projectName = parts[5]; // Using index 5 instead of 4 to get the actual project name
        // Extract the file name (main.sw or lib.sw) from the path
        const fileName = parts[parts.length - 1];
        // Extract the directory (src) from the path
        const dirName = parts[parts.length - 2];
        
        // Construct path directly to the file in the sway directory
        // Fix: Use just the project name without prefixing with 'sway/' since the outputDir already includes this path
        const swayPath = `${projectName}/${dirName}/${fileName}`;
        codeFilePath = path.resolve(outputDir, 'sway', swayPath);
        console.log(`[Debug] Special handling for Sway file: ${codePathRaw} => ${codeFilePath} (using output dir)`);
        console.log(`[Debug] Project name: ${projectName}, Dir: ${dirName}, File: ${fileName}, Path: ${swayPath}`);
      }
      // Handle special case for the create-fuels-counter-guide paths
      else if (codePathRaw.startsWith('/../../create-fuels-counter-guide/')) {
        const counterGuidePath = codePathRaw.replace('/../../create-fuels-counter-guide/', '');
        codeFilePath = path.resolve(workspaceRoot, 'docs/fuels-ts/apps/create-fuels-counter-guide', counterGuidePath);
        console.log(`[Debug] Special handling for counter guide: ${codePathRaw} => ${codeFilePath}`);
      }
      // Handle demo files (demo-fuels, demo-typegen, demo-wallet-sdk-react, etc.)
      else if (codePathRaw.match(/^\/\.\.\/(\.\.\/)?demo-[a-zA-Z0-9-]+\//)) {
        // Extract the demo name from the path
        const matches = codePathRaw.match(/^\/\.\.\/(?:\.\.\/)?demo-([a-zA-Z0-9-]+)\/(.+)$/);
        if (matches) {
          const demoName = `demo-${matches[1]}`;
          const remainingPath = matches[2];
          // Fix: Demo directories are directly under apps/, not under apps/docs/
          const demoPath = `docs/fuels-ts/apps/${demoName}/${remainingPath}`;
          codeFilePath = path.resolve(workspaceRoot, demoPath);
          console.log(`[Debug] Special handling for demo file: ${codePathRaw} => ${codeFilePath}`);
        } else {
          // Fallback for unparseable demo paths
          const relativePath = codePathRaw.substring(1);
          codeFilePath = path.resolve(markdownFileDir, relativePath);
          console.log(`[Debug] Fallback handling for demo file: ${codePathRaw} => ${codeFilePath}`);
        }
      }
      // Handle package files (like /../../../packages/account/...)
      else if (codePathRaw.startsWith('/../../../packages/')) {
        const packagePath = codePathRaw.replace('/../../../packages/', '');
        codeFilePath = path.resolve(workspaceRoot, 'docs/fuels-ts/packages', packagePath);
        console.log(`[Debug] Special handling for package file: ${codePathRaw} => ${codeFilePath}`);
      }
      // Handle guide-related snippets (like /../../docs/src/guide/...)
      else if (codePathRaw.startsWith('/../../docs/src/guide/')) {
        const guidePath = codePathRaw.replace('/../../docs/src/guide/', '');
        codeFilePath = path.resolve(workspaceRoot, 'docs/fuels-ts/apps/docs/src/guide', guidePath);
        console.log(`[Debug] Special handling for guide snippet: ${codePathRaw} => ${codeFilePath}`);
      }
      // Handle special case for paths starting with /../../
      else if (codePathRaw.startsWith('/../../')) {
        const relativePath = codePathRaw.substring(1); // Remove only the first slash
        console.log(`[Debug] Special case for /../../: ${relativePath}`);
        codeFilePath = path.resolve(markdownFileDir, relativePath);
      }
      // Treat both '/' and '@/' prefixes as relative to codeSourceDir
      else if (codePathRaw.startsWith('/') || codePathRaw.startsWith('@/')) {
        const prefixLength = codePathRaw.startsWith('/') ? 1 : 2;
        const relativePath = codePathRaw.substring(prefixLength);
        console.log(`[Debug] Handling code source relative path (${codePathRaw.substring(0, prefixLength)}): ${codePathRaw}`);
        
        // Fix for paths like /../ - strip leading slash but keep the relativity
        if (relativePath.startsWith('../')) {
          console.log(`[Debug] Special case: path with leading slash and relativity: ${relativePath}`);
          codeFilePath = path.resolve(markdownFileDir, relativePath);
        } else {
          codeFilePath = path.resolve(codeSourceDir, relativePath);
        }
      } else { // Relative paths like ./snippets/contract.ts or ../../common.ts
        // Resolve relative to the markdown file's directory
        console.log(`[Debug] Handling file relative path: ${codePathRaw}`);
        codeFilePath = path.resolve(markdownFileDir, codePathRaw);
      }
      codeFilePath = path.normalize(codeFilePath);
      // --- End Path Resolution ---
      
      console.log(`[Debug] Directive: '${line.trim()}' => Resolved code path: ${codeFilePath}, Region: ${region}`);
      // Add detailed check before fs.pathExists
      console.log(`[Debug] About to check existence of: "${codeFilePath}"`);

      if (!(await fs.pathExists(codeFilePath))) {
        console.warn(`WARN: Code file not found at resolved path: ${codeFilePath} (raw: ${codePathRaw}, referenced in ${filePath})`);
        processedLines.push(`\`\`\`\nError: Code snippet file not found: ${codePathRaw}\n(Resolved to: ${codeFilePath})\n\`\`\``);
        continue;
      }

      const stats = await fs.stat(codeFilePath);
      if (stats.isDirectory()) {
          console.error(`ERROR: Path is a directory, not a file: ${codeFilePath} (raw: ${codePathRaw}, referenced in ${filePath})`);
          processedLines.push(`\`\`\`\nError: Path is a directory, not a file: ${codePathRaw}\n(Resolved to: ${codeFilePath})\n\`\`\``);
          continue;
      }

      let codeContent = '';
      try {
        codeContent = await fs.readFile(codeFilePath, 'utf-8');
      } catch (readError) {
        console.error(`ERROR: Could not read code file: ${codeFilePath}`, readError);
        processedLines.push(`\`\`\`\nError: Could not read code snippet file: ${codePathRaw}\n(Resolved to: ${codeFilePath})\n\`\`\``);
        continue;
      }

      let snippet = '';

      if (region) {
        // NOTE: Using simplified region markers for robustness
        const startMarkerString = `// #region ${region}`;
        const endMarkerString = `// #endregion ${region}`;
        
        const startIndex = codeContent.indexOf(startMarkerString);
        let endIndex = -1;
        if (startIndex !== -1) {
          endIndex = codeContent.indexOf(endMarkerString, startIndex + startMarkerString.length);
        }

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const startLineEnd = codeContent.indexOf('\n', startIndex);
          // Ensure endLineStart points to the beginning of the end marker line
          const endLineStart = codeContent.lastIndexOf('\n', endIndex); 

          if (startLineEnd !== -1 && endLineStart !== -1) {
             let extractedSnippet = codeContent.substring(startLineEnd + 1, endLineStart);

             // --- Dedenting Logic ---
             const snippetLines = extractedSnippet.split('\n');
             if (snippetLines.length > 0) {
               let minIndent = Infinity;
               let firstLineIndex = -1;
               snippetLines.forEach((line, index) => {
                 if (line.trim().length > 0) {
                    if (firstLineIndex === -1) firstLineIndex = index;
                   const indentMatch = line.match(/^\s*/);
                   minIndent = Math.min(minIndent, indentMatch ? indentMatch[0].length : 0);
                 }
               });
               
                if (minIndent > 0 && minIndent !== Infinity && firstLineIndex !== -1) {
                    // Dedent relative to the first non-empty line's indentation
                    const referenceIndent = (snippetLines[firstLineIndex].match(/^\s*/) || [''])[0].length;
                    extractedSnippet = snippetLines.map(line =>
                        line.length >= referenceIndent ? line.substring(referenceIndent) : line
                    ).join('\n');
               }
                extractedSnippet = extractedSnippet.trim(); // Trim leading/trailing whitespace/newlines
             }
             // --- End Dedenting ---
             snippet = extractedSnippet;
          } else {
             console.warn(`WARN: Could not properly determine snippet boundaries for region '${region}' in ${codeFilePath}. Using full file.`);
             snippet = codeContent.trim();
          }
        } else {
          console.warn(`WARN: Region '${region}' not found or invalid in ${codeFilePath}. Using full file.`);
          snippet = codeContent.trim();
        }
      } else {
        snippet = codeContent.trim();
      }

      // --- Determine final language for code block --- 
      let finalLang = '';
      if (langHint && langHint.match(/^[a-zA-Z0-9]+$/)) {
        finalLang = langHint;
      } else {
        const extLang = path.extname(codeFilePath).substring(1);
        if (extLang.match(/^[a-zA-Z0-9]+$/)) {
          finalLang = extLang;
        }
      }
      // --- End language determination ---

      processedLines.push(`\`\`\`${finalLang}\n${snippet}\n\`\`\``);
    } else {
      processedLines.push(line);
    }
  }

  await fs.writeFile(outputPath, processedLines.join('\n'));
}

// --- NEW SUMMARY GENERATION ---
interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

/**
 * Extracts the sidebar structure from the VitePress config file and generates a SUMMARY.md file
 * @param configPath Path to the VitePress config.ts file
 * @param bookSrcDir Path where the SUMMARY.md file should be created
 */
async function generateSummaryFromConfig(configPath: string, bookSrcDir: string) {
  const summaryPath = path.join(bookSrcDir, 'SUMMARY.md');
  console.log(`Generating SUMMARY.md from ${configPath}`);

  try {
    // Read the config file
    const configContent = await fs.readFile(configPath, 'utf-8');
    console.log(`Config file read successfully (${configContent.length} bytes)`);
    
    // Try multiple extraction strategies
    let extractedSidebar: SidebarItem[] = [];
    
    // Strategy 1: Standard sidebar extraction
    extractedSidebar = extractSidebarFromConfig(configContent);
    
    // Strategy 2: If that fails, try a direct file scan
    if (!extractedSidebar || extractedSidebar.length === 0) {
      console.log('Standard extraction failed, trying direct file scan...');
      extractedSidebar = scanEntireFileForSidebar(configContent);
    }
    
    if (!extractedSidebar || extractedSidebar.length === 0) {
      console.error('All extraction methods failed. Using fallback structure.');
      const fallbackStructure = createFallbackStructure();
      
      // Print fallback structure for debugging
      console.log(`Using fallback structure with ${fallbackStructure.length} sections`);
      
      const summaryContent = generateSummaryContent(fallbackStructure);
      await fs.writeFile(summaryPath, summaryContent);
      console.log(`Generated SUMMARY.md with fallback structure at ${summaryPath}`);
      return;
    }
    
    // Debug the extracted structure
    console.log(`Successfully extracted ${extractedSidebar.length} sections from sidebar`);
    
    // Generate SUMMARY.md content
    const summaryContent = generateSummaryContent(extractedSidebar);
    
    // Debug the generated content
    const lineCount = summaryContent.split('\n').length;
    console.log(`Generated SUMMARY.md content with ${lineCount} lines`);
    
    // Write to SUMMARY.md
    await fs.writeFile(summaryPath, summaryContent);
    console.log(`Successfully wrote SUMMARY.md at ${summaryPath}`);
  } catch (error) {
    console.error('Error generating SUMMARY.md:', error);
    
    // Try fallback as a last resort
    try {
      console.log('Attempting to generate SUMMARY.md using fallback structure');
      const fallbackStructure = createFallbackStructure();
      const summaryContent = generateSummaryContent(fallbackStructure);
      await fs.writeFile(summaryPath, summaryContent);
      console.log(`Generated SUMMARY.md with fallback structure at ${summaryPath}`);
    } catch (fallbackError) {
      console.error('Failed to generate SUMMARY.md with fallback structure:', fallbackError);
      throw new Error(`Failed to generate SUMMARY.md: ${error}`);
    }
  }
}

/**
 * Extracts the sidebar structure from the config content
 * @param configContent The content of the VitePress config.ts file
 * @returns Array of sidebar items
 */
function extractSidebarFromConfig(configContent: string): SidebarItem[] {
  try {
    // First find the sidebar section
    const sidebarIndex = configContent.indexOf('sidebar:');
    if (sidebarIndex === -1) {
      console.error('Could not find sidebar configuration in the file');
      return [];
    }
    
    console.log(`Found sidebar at position ${sidebarIndex}`);
    
    // Find the opening bracket of the sidebar array
    const bracketIndex = configContent.indexOf('[', sidebarIndex);
    if (bracketIndex === -1) {
      console.error('Could not find opening bracket of sidebar array');
      return [];
    }
    
    // Count brackets to find the matching closing bracket
    let openBrackets = 1;
    let closeBrackets = 0;
    let i = bracketIndex + 1;
    
    while (i < configContent.length && openBrackets > closeBrackets) {
      const char = configContent[i];
      
      // Count brackets
      if (char === '[') openBrackets++;
      if (char === ']') closeBrackets++;
      
      i++;
      
      // Break when we've found the matching bracket
      if (openBrackets === closeBrackets) break;
    }
    
    if (openBrackets !== closeBrackets) {
      console.error('Could not find closing bracket of sidebar array');
      return [];
    }
    
    // Extract the entire sidebar array
    const sidebarContent = configContent.substring(bracketIndex, i);
    console.log(`Extracted sidebar content of length ${sidebarContent.length}`);
    
    // Now let's parse the structure as we observed it:
    // The sidebar in this VitePress config has nested structure
    
    // First level sections 
    const sections: SidebarItem[] = [];
    
    // Direct parsing approach
    try {
      // First, find top-level objects with nested items
      const topLevelObjects = findTopLevelObjects(sidebarContent);
      
      for (const topLevelObj of topLevelObjects) {
        // Check for nested item arrays 
        const itemsIndex = topLevelObj.indexOf('items:');
        if (itemsIndex === -1) continue;
        
        // Find all second-level items which will be our section headers
        const nestedItems = extractNestedItems(topLevelObj, itemsIndex);
        
        for (const nestedItem of nestedItems) {
          // For each nested item, we need text, link, and possibly items
          const textMatch = nestedItem.match(/text\s*:\s*['"]([^'"]+)['"]/);
          const linkMatch = nestedItem.match(/link\s*:\s*['"]([^'"]+)['"]/);
          
          if (textMatch) {
            const text = textMatch[1];
            const link = linkMatch ? linkMatch[1] : undefined;
            
            // Check for third-level nested items
            const itemsMatch = nestedItem.indexOf('items:');
            if (itemsMatch !== -1) {
              // This is a section with subitems
              const subItems = extractNestedItems(nestedItem, itemsMatch);
              
              // Convert to SidebarItem objects
              const formattedItems: SidebarItem[] = [];
              
              for (const subItem of subItems) {
                const subTextMatch = subItem.match(/text\s*:\s*['"]([^'"]+)['"]/);
                const subLinkMatch = subItem.match(/link\s*:\s*['"]([^'"]+)['"]/);
                
                if (subTextMatch && subLinkMatch) {
                  formattedItems.push({
                    text: subTextMatch[1],
                    link: subLinkMatch[1]
                  });
                }
              }
              
              if (formattedItems.length > 0) {
                sections.push({
                  text,
                  link,
                  items: formattedItems
                });
              }
            } else if (link) {
              // This is a standalone item
              sections.push({
                text,
                link
              });
            }
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing sidebar structure:', parseError);
      return [];
    }
    
    console.log(`Extracted ${sections.length} sections from sidebar`);
    return sections;
  } catch (error) {
    console.error('Error extracting sidebar:', error);
    return [];
  }
}

/**
 * Extract nested items from an object string
 */
function extractNestedItems(objString: string, itemsIndex: number): string[] {
  const items: string[] = [];
  
  // Find the opening bracket of the items array
  let bracketIndex = -1;
  for (let i = itemsIndex + 5; i < objString.length; i++) {
    if (objString[i] === '[') {
      bracketIndex = i;
      break;
    }
  }
  
  if (bracketIndex === -1) return [];
  
  // Extract individual items from the array
  let depth = 0;
  let currentItem = '';
  let inObject = false;
  
  for (let i = bracketIndex + 1; i < objString.length; i++) {
    const char = objString[i];
    
    if (char === '{') {
      depth++;
      if (depth === 1) {
        inObject = true;
        currentItem = '{';
      } else {
        currentItem += char;
      }
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        inObject = false;
        currentItem += '}';
        items.push(currentItem);
        currentItem = '';
      } else {
        currentItem += char;
      }
    } else if (char === ']' && depth === 0) {
      // End of items array
      break;
    } else if (inObject) {
      currentItem += char;
    }
  }
  
  return items;
}

/**
 * Find all top-level objects in an array string
 */
function findTopLevelObjects(arrayContent: string): string[] {
  const objects: string[] = [];
  let inObject = false;
  let objectStart = -1;
  let braceCount = 0;
  
  // Skip the opening bracket of the array
  let startIndex = arrayContent.indexOf('[') + 1;
  
  for (let i = startIndex; i < arrayContent.length; i++) {
    const char = arrayContent[i];
    
    if (char === '{' && !inObject) {
      inObject = true;
      objectStart = i;
      braceCount = 1;
    } else if (char === '{' && inObject) {
      braceCount++;
    } else if (char === '}' && inObject) {
      braceCount--;
      
      if (braceCount === 0) {
        inObject = false;
        const objectContent = arrayContent.substring(objectStart, i + 1);
        objects.push(objectContent);
      }
    }
  }
  
  return objects;
}

/**
 * Fallback function to extract sections using regex
 */
function extractSectionsWithRegex(content: string): SidebarItem[] {
  const sections: SidebarItem[] = [];
  
  // Use a more flexible regex pattern
  const sectionRegex = /{\s*text\s*:\s*['"]([^'"]+)['"].*?items\s*:\s*\[(.*?)\].*?}/gs;
  
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const [, text, itemsContent] = match;
    
    if (text) {
      // Use a flexible regex to extract items
      const items = parseItemsFlexible(itemsContent);
      
      if (items.length > 0) {
        sections.push({
          text,
          items
        });
      }
    }
  }
  
  return sections;
}

/**
 * More flexible item parsing
 */
function parseItemsFlexible(itemsContent: string): SidebarItem[] {
  const items: SidebarItem[] = [];
  
  // Look for objects with text and link properties in any order
  const itemRegex = /{\s*(?:text\s*:\s*['"]([^'"]+)['"].*?link\s*:\s*['"]([^'"]+)['"]|link\s*:\s*['"]([^'"]+)['"].*?text\s*:\s*['"]([^'"]+)['"])/gs;
  
  let match;
  while ((match = itemRegex.exec(itemsContent)) !== null) {
    // Handle both property orders
    const text = match[1] || match[4];
    const link = match[2] || match[3];
    
    if (text && link) {
      items.push({
        text,
        link
      });
    }
  }
  
  return items;
}

/**
 * Parses individual items from a section's items content
 */
function parseItems(itemsContent: string): SidebarItem[] {
  // First try to find top-level objects in the array
  const itemObjects = findTopLevelObjects(itemsContent);
  const items: SidebarItem[] = [];
  
  for (const itemObj of itemObjects) {
    // Try to extract text property
    const textMatch = itemObj.match(/text\s*:\s*['"]([^'"]+)['"]/);
    
    // Try to extract link property
    const linkMatch = itemObj.match(/link\s*:\s*['"]([^'"]+)['"]/);
    
    if (textMatch && linkMatch) {
      items.push({
        text: textMatch[1],
        link: linkMatch[1]
      });
    }
  }
  
  // If we couldn't find any items, fall back to regex
  if (items.length === 0) {
    return parseItemsFlexible(itemsContent);
  }
  
  return items;
}

/**
 * Generates the SUMMARY.md content from the sidebar items
 * @param items The sidebar items
 * @returns The SUMMARY.md content
 */
function generateSummaryContent(items: SidebarItem[]): string {
  let content = '# Summary\n\n';
  content += '[Introduction](README.md)\n\n';
  
  for (const section of items) {
    if (!section.text || !section.items || section.items.length === 0) {
      console.warn(`Skipping section with missing text or no items`);
      continue;
    }
    
    // Find first item with a link to use for section link
    const firstItem = section.items[0];
    
    if (firstItem && firstItem.link) {
      // Section uses first child's link
      const sectionLink = convertLink(firstItem.link);
      content += `- [${section.text}](${sectionLink})\n`;
      
      // Add all items in this section
      for (const item of section.items) {
        if (item.text && item.link) {
          const itemLink = convertLink(item.link);
          content += `  - [${item.text}](${itemLink})\n`;
        }
      }
    } else {
      console.warn(`Skipping section "${section.text}" with no linkable items`);
    }
  }
  
  return content;
}

/**
 * Converts a VitePress link to MDBook format
 * @param link The VitePress link
 * @returns The MDBook link
 */
function convertLink(link: string): string {
  if (!link) return '';
  
  // Remove leading slash
  let result = link.startsWith('/') ? link.substring(1) : link;
  
  // Handle trailing slash by replacing with index.md
  if (result.endsWith('/')) {
    result = result + 'index.md';
  } else if (!result.endsWith('.md')) {
    // Add .md extension if not already present
    result = result + '.md';
  }
  
  return result;
}

// Create a fallback structure based on the directory structure
function createFallbackStructure(): SidebarItem[] {
  console.log('Creating fallback structure');
  // Provide a complete fallback structure that matches the VitePress config
  return [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Install', link: '/guide/install/' },
        { text: 'VS Code Extension', link: '/guide/vs-code-extension/' }
      ]
    },
    {
      text: 'Creating a Fuel dApp',
      collapsed: false,
      items: [
        { text: 'Create a new app', link: '/guide/creating-a-fuel-dapp/' },
        { text: 'First steps', link: '/guide/creating-a-fuel-dapp/first-steps/' },
        { text: 'Using predicate', link: '/guide/creating-a-fuel-dapp/using-predicate/' },
        { text: 'Writing contract', link: '/guide/creating-a-fuel-dapp/contract/' }
      ]
    },
    {
      text: 'Wallets',
      collapsed: false,
      items: [
        { text: 'Wallets', link: '/guide/wallets/' },
        { text: 'Create a wallet', link: '/guide/wallets/create-wallet/' },
        { text: 'Signing', link: '/guide/wallets/signing/' },
        { text: 'Using Fuelet', link: '/guide/wallets/using-fuelet/' },
        { text: 'Using Wallet Manager', link: '/guide/wallets/wallet-manager/' }
      ]
    },
    {
      text: 'Transactions',
      collapsed: false,
      items: [
        { text: 'Transactions', link: '/guide/transactions/' },
        { text: 'Creating & signing', link: '/guide/transactions/creating-signing/' },
        { text: 'Advanced', link: '/guide/transactions/advanced/' }
      ]
    },
    {
      text: 'Provider',
      collapsed: false,
      items: [
        { text: 'Provider', link: '/guide/provider/' },
        { text: 'Read blockchain data', link: '/guide/provider/reading-data/' },
        { text: 'Block explorer API', link: '/guide/provider/block-explorer/' }
      ]
    },
    {
      text: 'Types',
      collapsed: false,
      items: [
        { text: 'Types', link: '/guide/types/' },
        { text: 'Address', link: '/guide/types/address/' },
        { text: 'Asset ID', link: '/guide/types/asset-id/' },
        { text: 'Base Asset ID', link: '/guide/types/base-asset-id/' },
        { text: 'Bits256', link: '/guide/types/bits256/' },
        { text: 'Bytes', link: '/guide/types/bytes/' },
        { text: 'BytesLike', link: '/guide/types/bytes-like/' }
      ]
    },
    {
      text: 'Encoding',
      collapsed: false,
      items: [
        { text: 'Encoding', link: '/guide/encoding/' },
        { text: 'ABI', link: '/guide/encoding/abi/' }
      ]
    },
    {
      text: 'Contracts',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/guide/contracts/' },
        { text: 'Deploy contract', link: '/guide/contracts/deploy-contract/' },
        { text: 'Call contract', link: '/guide/contracts/call-contract/' },
        { text: 'Storage', link: '/guide/contracts/storage/' },
        { text: 'Proxy contracts', link: '/guide/contracts/proxy-contracts/' },
        { text: 'Configuration', link: '/guide/contracts/configuration/' }
      ]
    },
    {
      text: 'Scripts',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/guide/scripts/' },
        { text: 'Call script', link: '/guide/scripts/call-script/' }
      ]
    },
    {
      text: 'Predicates',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/guide/predicates/' },
        { text: 'Using predicate', link: '/guide/predicates/using-predicate/' },
        { text: 'Spending', link: '/guide/predicates/spending/' }
      ]
    },
    {
      text: 'Testing',
      collapsed: false,
      items: [
        { text: 'Testing', link: '/guide/testing/' },
        { text: 'Mocking', link: '/guide/testing/mocking/' }
      ]
    },
    {
      text: 'Cookbook',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/guide/cookbook/' },
        { text: 'Real Wallet vs Account', link: '/guide/cookbook/real-vs-account/' },
        { text: 'Custom Chain', link: '/guide/cookbook/custom-chain/' },
        { text: 'Fake Resources', link: '/guide/cookbook/fake-resources/' },
        { text: 'Max Outputs', link: '/guide/cookbook/max-outputs/' },
        { text: 'Manage Transaction', link: '/guide/cookbook/manage-tx/' },
        { text: 'Transfer Assets', link: '/guide/cookbook/transfer-assets/' },
        { text: 'Calculate Price', link: '/guide/cookbook/calculate-price/' }
      ]
    },
    {
      text: 'Utilities',
      collapsed: false,
      items: [
        { text: 'Utilities', link: '/guide/utilities/' },
        { text: 'Format units', link: '/guide/utilities/format-units/' },
        { text: 'Parse units', link: '/guide/utilities/parse-units/' }
      ]
    }
  ];
}

/**
 * Last resort function that scans the entire file for sidebar-like structures
 */
function scanEntireFileForSidebar(fileContent: string): SidebarItem[] {
  console.log('Scanning entire file for sidebar structure...');
  
  // Check if the content contains Vue Router-style routes
  if (fileContent.includes('routes:') || fileContent.includes('pages:')) {
    console.log('Found potential Vue Router-style routes');
    return extractRoutesAsSidebar(fileContent);
  }
  
  // Look for any object literals containing nested arrays of objects with text/link pairs
  const potentialStructures = findPotentialSidebarStructures(fileContent);
  if (potentialStructures.length > 0) {
    console.log(`Found ${potentialStructures.length} potential sidebar-like structures`);
    
    // Use the largest structure as it's likely the main navigation
    let bestStructure: SidebarItem[] = [];
    let maxItems = 0;
    
    for (const structure of potentialStructures) {
      const totalItems = countTotalItems(structure);
      if (totalItems > maxItems) {
        maxItems = totalItems;
        bestStructure = structure;
      }
    }
    
    console.log(`Selected structure with ${bestStructure.length} sections and ${maxItems} total items`);
    return bestStructure;
  }
  
  return [];
}

/**
 * Count total items in a sidebar structure (sections + all nested items)
 */
function countTotalItems(structure: SidebarItem[]): number {
  let count = structure.length;
  
  for (const section of structure) {
    if (section.items) {
      count += section.items.length;
    }
  }
  
  return count;
}

/**
 * Extract Vue Router routes as a sidebar structure
 */
function extractRoutesAsSidebar(content: string): SidebarItem[] {
  const results: SidebarItem[] = [];
  
  // Find router configuration
  const routesStart = Math.max(
    content.indexOf('routes:'),
    content.indexOf('pages:')
  );
  
  if (routesStart === -1) return [];
  
  // Find the array of routes
  const routesArrayStart = content.indexOf('[', routesStart);
  if (routesArrayStart === -1) return [];
  
  // Extract the array content
  let bracketCount = 1;
  let routesArrayEnd = -1;
  
  for (let i = routesArrayStart + 1; i < content.length; i++) {
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') bracketCount--;
    
    if (bracketCount === 0) {
      routesArrayEnd = i;
      break;
    }
  }
  
  if (routesArrayEnd === -1) return [];
  
  const routesContent = content.substring(routesArrayStart, routesArrayEnd + 1);
  
  // Extract individual routes
  const routeObjects = findTopLevelObjects(routesContent);
  
  // Group routes by their first path segment
  const groupedRoutes: Record<string, SidebarItem[]> = {};
  
  for (const routeObj of routeObjects) {
    // Extract path and name/component
    const pathMatch = routeObj.match(/path\s*:\s*['"]([^'"]+)['"]/);
    const nameMatch = routeObj.match(/(?:name|component)\s*:\s*['"]([^'"]+)['"]/);
    
    if (pathMatch) {
      const path = pathMatch[1];
      const name = nameMatch ? nameMatch[1] : path.split('/').pop() || path;
      
      // Get the first segment of the path
      const segments = path.split('/').filter(s => s);
      const group = segments.length > 0 ? segments[0] : 'root';
      
      if (!groupedRoutes[group]) {
        groupedRoutes[group] = [];
      }
      
      groupedRoutes[group].push({
        text: formatRouteName(name),
        link: path
      });
    }
  }
  
  // Create sidebar sections from the grouped routes
  for (const [group, items] of Object.entries(groupedRoutes)) {
    if (items.length > 0) {
      results.push({
        text: formatRouteName(group),
        items
      });
    }
  }
  
  return results;
}

/**
 * Format a route name for display
 */
function formatRouteName(name: string): string {
  // Convert camelCase or kebab-case to Title Case
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Find potential sidebar structures in the file content
 */
function findPotentialSidebarStructures(content: string): SidebarItem[][] {
  const structures: SidebarItem[][] = [];
  
  // Find all object literals with an items property that contains an array
  const itemsArrayPattern = /{\s*text\s*:\s*['"]([^'"]+)['"].*?items\s*:\s*\[/g;
  
  let match;
  while ((match = itemsArrayPattern.exec(content)) !== null) {
    const startPos = match.index;
    
    // Find the containing array that holds these objects
    let arrayStart = -1;
    for (let i = startPos; i >= 0; i--) {
      if (content[i] === '[') {
        arrayStart = i;
        break;
      }
    }
    
    if (arrayStart === -1) continue;
    
    // Find the end of this array
    let bracketCount = 1;
    let arrayEnd = -1;
    
    for (let i = arrayStart + 1; i < content.length; i++) {
      if (content[i] === '[') bracketCount++;
      if (content[i] === ']') bracketCount--;
      
      if (bracketCount === 0) {
        arrayEnd = i;
        break;
      }
    }
    
    if (arrayEnd === -1) continue;
    
    // Extract the array content
    const arrayContent = content.substring(arrayStart, arrayEnd + 1);
    
    // Try to parse this as a sidebar structure
    try {
      const topLevelObjects = findTopLevelObjects(arrayContent);
      
      if (topLevelObjects.length > 0) {
        const structure: SidebarItem[] = [];
        
        for (const obj of topLevelObjects) {
          const textMatch = obj.match(/text\s*:\s*['"]([^'"]+)['"]/);
          if (!textMatch) continue;
          
          const text = textMatch[1];
          const itemsMatch = obj.match(/items\s*:\s*\[(.*?)\]/s);
          
          if (itemsMatch) {
            const itemsContent = itemsMatch[1];
            const items = parseItemsFlexible(itemsContent);
            
            if (items.length > 0) {
              structure.push({
                text,
                items
              });
            }
          }
        }
        
        if (structure.length > 0) {
          structures.push(structure);
        }
      }
    } catch (e) {
      // Skip this potential structure if parsing fails
      continue;
    }
  }
  
  return structures;
}

// createBookToml remains the same
async function createBookToml(bookRootDir: string) {
  const tomlPath = path.join(bookRootDir, 'book.toml');
  const tomlContent = `[book]
title = "Fuels-ts Documentation"
authors = ["Fuel Labs"]
language = "en"
multilingual = false
src = "src"

[output.html]
default-theme = "navy"
preferred-dark-theme = "navy"
git-repository-url = "https://github.com/FuelLabs/fuels-ts"
edit-url-template = "https://github.com/FuelLabs/fuels-ts/edit/master/apps/docs/src/{path}"

[output.html.fold]
enable = true
level = 1

[output.html.playground]
editable = false

[output.html.search]
limit-results = 30

`;
  await fs.ensureDir(path.dirname(tomlPath));
  await fs.writeFile(tomlPath, tomlContent);
  console.log(`Generated book.toml at ${tomlPath}`);

  // Ensure the src/README.md exists
  const readmePath = path.join(bookRootDir, 'src', 'README.md');
   if (!fs.existsSync(readmePath)) {
       await fs.ensureDir(path.dirname(readmePath));
       const sourceReadme = path.join(sourceDir, 'README.md');
       let readmeContent = `# Fuels-ts Documentation\n\nGenerated mdBook.`;
       if (fs.existsSync(sourceReadme)) {
           try {
               readmeContent = await fs.readFile(sourceReadme, 'utf-8');
               console.log(`Using README.md from ${sourceReadme}`);
           } catch (e) {
               console.warn(`Could not read source README.md: ${e}`);
           }
       }
       await fs.writeFile(readmePath, readmeContent);
       console.log(`Generated README.md at ${readmePath}`);
   }
}

async function main() {
  try {
    console.log('Starting Fuels TypeScript mdBook generation...');
    console.log(`Source directory: ${sourceDir}`);
    console.log(`Output directory (Markdown): ${outputDir}`);
    console.log(`Book root directory: ${bookRootDir}`);
    console.log(`Code source base directory: ${codeSourceDir}`);
    console.log(`VitePress config path: ${vitePressConfigPath}`);

    // Verify config file exists
    if (!fs.existsSync(vitePressConfigPath)) {
      console.error(`ERROR: VitePress config file not found at ${vitePressConfigPath}`);
      process.exit(1);
    }

    // Clear existing output directory
    if (fs.existsSync(outputDir)) {
      console.log(`Clearing existing output directory: ${outputDir}`);
      await fs.rm(outputDir, { recursive: true, force: true });
    }
    await fs.ensureDir(outputDir);

    // --- START: Copy Sway Directories FIRST ---
    console.log('Copying Sway project directories...');
    const swaySourceDir = path.join(path.dirname(sourceDir), 'sway');
    const swayDestDir = path.join(outputDir, 'sway');
    
    if (fs.existsSync(swaySourceDir)) {
      try {
        await fs.ensureDir(swayDestDir);
        await fs.copy(swaySourceDir, swayDestDir, { overwrite: true });
        console.log(`  Copied Sway directory: ${path.relative(workspaceRoot, swaySourceDir)} -> ${path.relative(bookRootDir, swayDestDir)}`);
      } catch (copyError) {
        console.error(`  Error copying Sway directory:`, copyError);
      }
    } else {
      console.warn(`  Sway source directory not found at: ${swaySourceDir}`);
    }
    // --- END: Copy Sway Directories ---

    // --- START: Copy Snippet Directories ---
    console.log('Searching for snippet directories...');
    const potentialSnippetPaths = glob.sync('**/snippets', { cwd: sourceDir, absolute: true });
    const snippetDirs = potentialSnippetPaths.filter(p => {
      try {
        return fs.statSync(p).isDirectory();
      } catch (e) { return false; }
    });
    console.log(`Found ${snippetDirs.length} snippet directories to copy.`);
    for (const snippetDir of snippetDirs) {
      const relativePath = path.relative(sourceDir, snippetDir);
      const destinationPath = path.join(outputDir, relativePath);
      try {
        await fs.ensureDir(path.dirname(destinationPath));
        await fs.copy(snippetDir, destinationPath, { overwrite: true });
        console.log(`  Copied: ${relativePath} -> ${path.relative(bookRootDir, destinationPath)}`);
      } catch (copyError) {
        console.error(`  Error copying ${relativePath}:`, copyError);
      }
    }
    // --- END: Copy Snippet Directories ---

    // Find all markdown files in the source directory
    const files = glob.sync('**/*.md', { cwd: sourceDir, absolute: true });
    console.log(`Found ${files.length} markdown files.`);

    // Process each markdown file (copy and handle snippets)
    for (const file of files) {
      // Ensure the file being processed is not the config file itself if it ends with .md
      if (path.normalize(file) !== path.normalize(vitePressConfigPath) || !vitePressConfigPath.endsWith('.md')) {
         await processFile(file);
      }
    }

    console.log('\nProcessing complete. Generating configuration files...');

    // Test reading config file directly for debugging
    console.log(`Reading VitePress config from: ${vitePressConfigPath}`);
    const configContent = await fs.readFile(vitePressConfigPath, 'utf-8');
    console.log(`Config file length: ${configContent.length} characters`);
    
    // Check if sidebar configuration exists
    if (configContent.includes('sidebar:')) {
      console.log('Found sidebar configuration in config file');
    } else {
      console.warn('WARNING: Could not find sidebar configuration in config file');
    }

    // Generate SUMMARY.md from VitePress config
    await generateSummaryFromConfig(vitePressConfigPath, outputDir);

    // Generate book.toml and ensure README.md exists
    await createBookToml(bookRootDir);

    console.log('\nSuccessfully generated fuels-ts mdbook content and configuration.');

  } catch (error) {
    console.error('Error during generation:', error);
    process.exit(1);
  }
}

// Keep the self-executing wrapper for main
(async () => {
  await main();
})(); 