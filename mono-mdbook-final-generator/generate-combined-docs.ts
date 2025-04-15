import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

// Define paths
const workspaceRoot = path.resolve(__dirname, '..');
const booksDir = path.join(workspaceRoot, 'mono-mdbook-final');
const outputDir = path.join(workspaceRoot, 'mono-mdbook-final-output');
const outputFilePath = path.join(outputDir, 'combined-docs.md');

// Helper function to get all markdown files from a directory recursively
async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  // Use glob to find all .md files, excluding SUMMARY.md and summary.md
  const files = await glob.glob('**/*.md', {
    cwd: dir,
    ignore: ['**/SUMMARY.md', '**/summary.md'],
    nodir: true
  });
  
  return files.map(file => path.join(dir, file));
}

// Helper function to get book name from directory path
function getBookName(filePath: string): string {
  // Extract the book directory name from the path
  const relativePath = path.relative(booksDir, filePath);
  const bookDir = relativePath.split(path.sep)[0];
  return bookDir;
}

// Main function to generate the combined document
async function generateCombinedDoc() {
  console.log('Starting to generate combined documentation...');
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Get all book directories
  const bookDirs = await fs.readdir(booksDir);
  
  // Filter out non-directories and special files
  const validBookDirs = (await Promise.all(
    bookDirs.map(async (dir) => {
      const fullPath = path.join(booksDir, dir);
      const stats = await fs.stat(fullPath);
      return { dir, isDirectory: stats.isDirectory() };
    })
  )).filter(item => item.isDirectory && !item.dir.startsWith('.'))
    .map(item => item.dir);
  
  // Initialize combined content with a title
  let combinedContent = '# Combined Documentation\n\n';
  
  // Process each book
  for (const bookDir of validBookDirs) {
    const bookPath = path.join(booksDir, bookDir);
    
    // Skip if book.toml or similar non-content directories
    if (bookDir === 'book.toml' || bookDir === 'node_modules') {
      continue;
    }
    
    console.log(`Processing book: ${bookDir}`);
    
    // Add book header
    combinedContent += `## Book: ${bookDir}\n\n`;
    
    // Get all markdown files in the book directory
    const mdFiles = await getAllMarkdownFiles(bookPath);
    
    // Process each markdown file
    for (const filePath of mdFiles) {
      try {
        // Get relative path for logging
        const relativePath = path.relative(booksDir, filePath);
        console.log(`  Processing file: ${relativePath}`);
        
        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Add file header with the path information
        combinedContent += `### File: ${relativePath}\n\n`;
        
        // Add the content
        combinedContent += content + '\n\n';
        
        // Add separator
        combinedContent += '---\n\n';
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  }
  
  // Write the combined content to the output file
  await fs.writeFile(outputFilePath, combinedContent);
  
  console.log(`Combined documentation generated at: ${outputFilePath}`);
}

// Run the script
generateCombinedDoc().catch(error => {
  console.error('Error generating combined documentation:', error);
  process.exit(1);
}); 