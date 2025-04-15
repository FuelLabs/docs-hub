"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const glob_1 = require("glob");
const workspaceRoot = path.resolve(__dirname, '..', '..'); // Go up two levels from dist
const swayRepoPath = path.join(workspaceRoot, 'docs', 'sway');
const swayBookSrcRootPath = path.join(swayRepoPath, 'docs', 'book'); // Root of the source book
const swayBookSrcDir = path.join(swayBookSrcRootPath, 'src'); // Source markdown dir
const swayBookBuildPath = path.join(swayBookSrcRootPath, 'book'); // Default mdbook build output directory
const swayBookToml = path.join(swayBookSrcRootPath, 'book.toml'); // Source config file
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
function runCommand(command, cwd, env) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            console.log(`Running command in ${cwd}: ${command}`);
            (0, child_process_1.exec)(command, { cwd, env: Object.assign(Object.assign({}, process.env), env) }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${command}`);
                    console.error(stderr);
                    reject(error);
                    return;
                }
                console.log(stdout);
                resolve(stdout);
            });
        });
    });
}
function checkPandoc() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, child_process_1.execSync)('pandoc --version');
            console.log('Pandoc is installed.');
            return true;
        }
        catch (error) {
            console.error('Error: Pandoc is not installed or not found in PATH.');
            console.error('Please install Pandoc (https://pandoc.org/installing.html) and ensure it is added to your system PATH.');
            return false;
        }
    });
}
// Converts HTML to MD, placing result in the *temporary* directory
function convertHtmlToMd(htmlFilePath, tempOutputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const relativePath = path.relative(swayBookBuildPath, htmlFilePath);
        const mdFileName = path.basename(relativePath, '.html') + '.md';
        const mdOutputDir = path.join(tempOutputDir, path.dirname(relativePath)); // Use temp dir
        const mdOutputPath = path.join(mdOutputDir, mdFileName);
        yield fs.ensureDir(mdOutputDir);
        const pandocCommand = `pandoc "${htmlFilePath}" -f html -t gfm -o "${mdOutputPath}"`;
        try {
            console.log(`Converting: ${relativePath} -> ${path.relative(workspaceRoot, mdOutputPath)} (temp)`);
            yield runCommand(pandocCommand, workspaceRoot);
        }
        catch (error) {
            console.error(`Failed to convert ${htmlFilePath} to Markdown. Error: ${error}`);
        }
    });
}
// --- Main Execution --- 
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting Sway mdbook build, Pandoc conversion, and restructuring...');
        if (!(yield checkPandoc())) {
            process.exit(1);
        }
        try {
            // 1. Install prerequisites
            console.log(`Installing mdbook-forc-documenter from ${mdbookForcDocumenterPath}...`);
            yield runCommand(`cargo install --path . --force`, mdbookForcDocumenterPath);
            console.log('Installing forc plugins...');
            for (const pluginPath of forcPlugins) {
                if (pluginPath === 'forc-explore') {
                    try {
                        yield runCommand(`cargo install forc-explore --force`, swayRepoPath);
                    }
                    catch (e) {
                        console.warn(`forc-explore install failed/skipped: ${e}`);
                    }
                }
                else {
                    const fullPluginPath = path.join(swayRepoPath, pluginPath);
                    yield runCommand(`cargo install --path . --force`, fullPluginPath);
                }
            }
            // 2. Build the original mdbook
            console.log(`Building original Sway mdbook in ${swayBookSrcRootPath}...`);
            const cargoBinPath = process.env.CARGO_HOME ? path.join(process.env.CARGO_HOME, 'bin') : path.join(process.env.HOME || '~', '.cargo', 'bin');
            const buildEnv = { PATH: `${cargoBinPath}:${process.env.PATH}` };
            yield runCommand('mdbook build', swayBookSrcRootPath, buildEnv);
            console.log('Original Sway mdbook built successfully.');
            // 3. Prepare temporary directory for Markdown files
            console.log(`Clearing and preparing temporary directory for MD files: ${tempMdDirPath}`);
            yield fs.emptyDir(tempMdDirPath);
            // 4. Find and convert HTML files to Markdown (into temp dir)
            console.log(`Searching for HTML files in ${swayBookBuildPath}`);
            const htmlFiles = yield (0, glob_1.glob)(`${swayBookBuildPath}/**/*.html`, { absolute: true });
            console.log(`Found ${htmlFiles.length} HTML files to convert.`);
            if (htmlFiles.length === 0) {
                console.warn('No HTML files found in the build directory. Skipping conversion.');
                // Exit or handle error appropriately if HTML is expected
            }
            else {
                console.log('Converting HTML files to Markdown (into temporary directory)...');
                for (const file of htmlFiles) {
                    yield convertHtmlToMd(file, tempMdDirPath); // Convert into temp dir
                }
            }
            // 5. Prepare final destination directory
            console.log(`Clearing and preparing final destination directory: ${finalMdbookDestPath}`);
            yield fs.emptyDir(finalMdbookDestPath);
            yield fs.ensureDir(finalMdbookDestSrcPath); // Create the src directory
            // 6. Copy necessary structure files from original source to final destination
            console.log(`Copying book.toml from ${swayBookToml} to ${finalMdbookDestPath}`);
            yield fs.copy(swayBookToml, path.join(finalMdbookDestPath, 'book.toml'));
            console.log(`Copying SUMMARY.md from ${swayBookSummary} to ${finalMdbookDestSrcPath}`);
            yield fs.copy(swayBookSummary, path.join(finalMdbookDestSrcPath, 'SUMMARY.md'));
            const themeDir = path.join(swayBookSrcRootPath, 'theme');
            if (yield fs.pathExists(themeDir)) {
                console.log(`Copying theme directory to ${finalMdbookDestPath}/theme`);
                yield fs.copy(themeDir, path.join(finalMdbookDestPath, 'theme'));
            }
            // 7. Move converted Markdown files from temp dir to final destination's src dir
            console.log(`Moving converted MD files from ${tempMdDirPath} to ${finalMdbookDestSrcPath}`);
            // Use copy and then remove for robustness, or move directly if preferred
            yield fs.copy(tempMdDirPath, finalMdbookDestSrcPath, { overwrite: true });
            // 8. Clean up temporary directory
            console.log(`Cleaning up temporary directory: ${tempMdDirPath}`);
            yield fs.remove(tempMdDirPath);
            console.log('------------------------------------');
            console.log(`✅ Sway mdbook Pandoc conversion and restructuring complete!`);
            console.log(`   Servable mdbook structure created in: ${finalMdbookDestPath}`);
            console.log(`   Contains Markdown content converted from HTML.`);
            console.log(`\n   To serve this book locally, run:`);
            console.log(`   cd ${path.relative(workspaceRoot, finalMdbookDestPath)} && mdbook serve`);
            console.log('------------------------------------');
        }
        catch (error) {
            console.error('\n❌ An error occurred during the process:');
            console.error(error);
            process.exit(1);
        }
    });
}
main();
