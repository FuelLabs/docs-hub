import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { globby } from 'globby';

// Define paths
const baseDir = path.resolve('extract-md-files');
const sourceDocsDir = path.join(baseDir, 'docs');
const projectRootDir = path.resolve('.'); // Project root
const outputManifestFile = path.join(projectRootDir, 'mono-fuel-doc.md'); // Output to root
const outputZipFile = path.join(projectRootDir, 'multi-fuel-doc.zip'); // Output to root

async function packageDocs() {
  console.log('Starting documentation packaging...');

  // --- 1. Find and sort all .md files ---
  console.log(`Scanning for .md files in ${sourceDocsDir}...`);
  const mdFiles = await globby(`${sourceDocsDir}/**/*.md`);
  mdFiles.sort(); // Sort alphabetically for consistent order

  if (mdFiles.length === 0) {
    console.warn(
      `No .md files found in ${sourceDocsDir}. Manifest will be empty.`
    );
  } else {
    console.log(`Found and sorted ${mdFiles.length} .md files.`);
  }

  // --- 2. Create the concatenated content file (mono-fuel-doc.md) ---
  console.log(`Generating concatenated content file: ${outputManifestFile}...`);
  let concatenatedContent = ''; // Initialize empty string
  for (let i = 0; i < mdFiles.length; i++) {
    const filePath = mdFiles[i];
    const relativePath = path.relative(baseDir, filePath); // Get path relative to extract-md-files/
    console.log(`  Appending content from: ${relativePath}`);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (i > 0) {
        // Add separator before appending subsequent files
        concatenatedContent += `\n\n---\n\n### File: ${relativePath}\n\n`;
      } else {
        // Optional: Add header for the very first file
        concatenatedContent += `### File: ${relativePath}\n\n`;
      }
      concatenatedContent += fileContent;
    } catch (readError) {
      console.warn(
        `  Warning: Could not read file ${filePath}: ${readError.message}. Skipping.`
      );
    }
  }

  try {
    fs.writeFileSync(outputManifestFile, concatenatedContent);
    console.log(`Successfully created ${outputManifestFile}.`);
  } catch (error) {
    console.error(`Error writing manifest file ${outputManifestFile}:`, error);
    process.exit(1); // Exit if manifest creation fails
  }

  // --- 3. Create the zip file (multi-fuel-doc.zip) ---
  console.log(`Creating zip archive: ${outputZipFile}...`);
  try {
    if (!fs.existsSync(sourceDocsDir)) {
      throw new Error(
        `Source directory for zipping not found: ${sourceDocsDir}`
      );
    }
    const zip = new AdmZip();
    // Add the directory contents directly, placing them inside a 'docs' folder in the zip
    zip.addLocalFolder(sourceDocsDir, 'docs');
    zip.writeZip(outputZipFile);
    console.log(`Successfully created ${outputZipFile}.`);
  } catch (error) {
    console.error(`Error creating zip file ${outputZipFile}:`, error);
    process.exit(1); // Exit if zipping fails
  }

  console.log('Documentation packaging completed successfully.');
}

packageDocs().catch((error) => {
  console.error('An unexpected error occurred during packaging:', error);
  process.exit(1);
});
