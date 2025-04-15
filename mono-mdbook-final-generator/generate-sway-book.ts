import { execSync, exec, spawn, execFile } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { glob } from 'glob';
import * as os from 'os';

const workspaceRoot = path.resolve(__dirname, '..'); // Go up one level to docs-hub
const swayRepoPath = path.join(workspaceRoot, 'docs', 'sway'); // Point to docs/sway
const swayBookSrcRootPath = path.join(swayRepoPath, 'docs', 'book'); // Root of the source book
const swayBookSrcDir = path.join(swayBookSrcRootPath, 'src');      // Source markdown dir
const swayBookBuildPath = path.join(swayBookSrcRootPath, 'book');    // Default mdbook build output directory
const swayBookToml = path.join(swayBookSrcRootPath, 'book.toml');   // Source config file
const swayBookSummary = path.join(swayBookSrcDir, 'SUMMARY.md'); // Source summary file

const finalMdbookDestPath = path.join(workspaceRoot, 'mono-mdbook-final', 'sway'); // Final destination for servable book
const finalMdbookDestSrcPath = path.join(finalMdbookDestPath, 'src'); // src dir in final destination
const tempMdDirPath = path.join(workspaceRoot, 'mono-mdbook-final', 'sway-temp-md'); // Temp dir for Pandoc output

const mdbookForcDocumenterPath = path.join(swayRepoPath, 'scripts', 'mdbook-forc-documenter');

const forcPlugins = [
    'forc-plugins/forc-client',
    'forc-plugins/forc-doc',
    'forc-explore', // Assumed to be installed via cargo install directly
    'forc-plugins/forc-fmt',
    'forc-plugins/forc-lsp',
];

// --- Helper Functions --- 

async function runCommand(command: string, cwd: string, env?: NodeJS.ProcessEnv): Promise<string> {
    try {
        console.log(`Running command in ${cwd}: ${command}`);
        
        // Create a temporary shell script file
        const tmpDir = os.tmpdir();
        const scriptPath = path.join(tmpDir, `run_${Date.now()}.sh`);
        
        // Write the command to the script file
        fs.writeFileSync(scriptPath, `#!/bin/bash\ncd "${cwd}" && ${command}\n`, { mode: 0o755 });
        
        // Execute the script directly
        const result = execSync(scriptPath, { 
            env: { ...process.env, ...env },
            stdio: 'inherit'
        });
        
        // Clean up the temporary script
        fs.unlinkSync(scriptPath);
        
        return result ? result.toString() : '';
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        throw error;
    }
}

async function checkPandoc(): Promise<boolean> {
    try {
        console.log(`Running pandoc version check...`);
        execSync('pandoc --version', { stdio: 'inherit' });
        console.log('Pandoc is installed.');
        return true;
    } catch (error) {
        console.error('Error: Pandoc is not installed or not found in PATH.');
        console.error('Please install Pandoc (https://pandoc.org/installing.html) and ensure it is added to your system PATH.');
        return false;
    }
}

// Converts HTML to MD, placing result in the *temporary* directory
async function convertHtmlToMd(htmlFilePath: string, tempOutputDir: string): Promise<void> {
    const relativePath = path.relative(swayBookBuildPath, htmlFilePath);
    const mdFileName = path.basename(relativePath, '.html') + '.md'; 
    const mdOutputDir = path.join(tempOutputDir, path.dirname(relativePath)); // Use temp dir
    const mdOutputPath = path.join(mdOutputDir, mdFileName);

    await fs.ensureDir(mdOutputDir);

    const pandocCommand = `pandoc "${htmlFilePath}" -f html -t gfm -o "${mdOutputPath}"`;
    try {
        console.log(`Converting: ${relativePath} -> ${path.relative(workspaceRoot, mdOutputPath)} (temp)`);
        await runCommand(pandocCommand, workspaceRoot); 
    } catch (error) {
        console.error(`Failed to convert ${htmlFilePath} to Markdown. Error: ${error}`);
    }
}

// --- Main Execution --- 

async function main() {
    console.log('Starting Sway mdbook build, Pandoc conversion, and restructuring...');
    
    // Log paths for debugging
    console.log(`workspaceRoot: ${workspaceRoot}`);
    console.log(`swayRepoPath: ${swayRepoPath}`);
    console.log(`swayBookSrcRootPath: ${swayBookSrcRootPath}`);
    console.log(`mdbookForcDocumenterPath: ${mdbookForcDocumenterPath}`);
    
    // Check if directories exist
    console.log(`Checking if directories exist...`);
    console.log(`swayRepoPath exists: ${await fs.pathExists(swayRepoPath)}`);
    console.log(`swayBookSrcRootPath exists: ${await fs.pathExists(swayBookSrcRootPath)}`);
    console.log(`mdbookForcDocumenterPath exists: ${await fs.pathExists(mdbookForcDocumenterPath)}`);

    if (!await checkPandoc()) {
        process.exit(1);
    }

    try {
        // 1. Install prerequisites
        console.log(`Installing mdbook-forc-documenter from ${mdbookForcDocumenterPath}...`);
        await runCommand(`cargo install --path . --force`, mdbookForcDocumenterPath);
        console.log('Installing forc plugins...');
        for (const pluginPath of forcPlugins) {
            if (pluginPath === 'forc-explore') {
                try { await runCommand(`cargo install forc-explore --force`, swayRepoPath); } catch (e) { console.warn(`forc-explore install failed/skipped: ${e}`); }
            } else {
                const fullPluginPath = path.join(swayRepoPath, pluginPath);
                await runCommand(`cargo install --path . --force`, fullPluginPath);
            }
        }

        // 2. Build the original mdbook
        console.log(`Building original Sway mdbook in ${swayBookSrcRootPath}...`);
        const cargoBinPath = process.env.CARGO_HOME ? path.join(process.env.CARGO_HOME, 'bin') : path.join(process.env.HOME || '~', '.cargo', 'bin');
        const buildEnv = { PATH: `${cargoBinPath}:${process.env.PATH}` };
        await runCommand('mdbook build', swayBookSrcRootPath, buildEnv);
        console.log('Original Sway mdbook built successfully.');

        // 3. Prepare temporary directory for Markdown files
        console.log(`Clearing and preparing temporary directory for MD files: ${tempMdDirPath}`);
        await fs.emptyDir(tempMdDirPath);

        // 4. Find and convert HTML files to Markdown (into temp dir)
        console.log(`Searching for HTML files in ${swayBookBuildPath}`);
        const htmlFiles = await glob(`${swayBookBuildPath}/**/*.html`, { absolute: true }); 
        console.log(`Found ${htmlFiles.length} HTML files to convert.`);
        if (htmlFiles.length === 0) {
            console.warn('No HTML files found in the build directory. Skipping conversion.');
            // Exit or handle error appropriately if HTML is expected
        } else {
            console.log('Converting HTML files to Markdown (into temporary directory)...');
            for (const file of htmlFiles) {
                 await convertHtmlToMd(file, tempMdDirPath); // Convert into temp dir
            }
        }

        // 5. Prepare final destination directory
        console.log(`Clearing and preparing final destination directory: ${finalMdbookDestPath}`);
        await fs.emptyDir(finalMdbookDestPath);
        await fs.ensureDir(finalMdbookDestSrcPath); // Create the src directory

        // 6. Copy necessary structure files from original source to final destination
        console.log(`Copying book.toml from ${swayBookToml} to ${finalMdbookDestPath}`);
        await fs.copy(swayBookToml, path.join(finalMdbookDestPath, 'book.toml'));
        console.log(`Copying SUMMARY.md from ${swayBookSummary} to ${finalMdbookDestSrcPath}`);
        await fs.copy(swayBookSummary, path.join(finalMdbookDestSrcPath, 'SUMMARY.md'));
        const themeDir = path.join(swayBookSrcRootPath, 'theme');
        if (await fs.pathExists(themeDir)) {
            console.log(`Copying theme directory to ${finalMdbookDestPath}/theme`);
            await fs.copy(themeDir, path.join(finalMdbookDestPath, 'theme'));
        }

        // 7. Move converted Markdown files from temp dir to final destination's src dir
        console.log(`Moving converted MD files from ${tempMdDirPath} to ${finalMdbookDestSrcPath}`);
        // Use copy and then remove for robustness, or move directly if preferred
        await fs.copy(tempMdDirPath, finalMdbookDestSrcPath, { overwrite: true });
        
        // 8. Clean up temporary directory
        console.log(`Cleaning up temporary directory: ${tempMdDirPath}`);
        await fs.remove(tempMdDirPath);

        console.log('------------------------------------');
        console.log(`✅ Sway mdbook Pandoc conversion and restructuring complete!`);
        console.log(`   Servable mdbook structure created in: ${finalMdbookDestPath}`);
        console.log(`   Contains Markdown content converted from HTML.`);
        console.log(`\n   To serve this book locally, run:`);
        console.log(`   cd ${path.relative(workspaceRoot, finalMdbookDestPath)} && mdbook serve`);
        console.log('------------------------------------');

    } catch (error) {
        console.error('\n❌ An error occurred during the process:');
        console.error(error);
        process.exit(1);
    }
}

main(); 