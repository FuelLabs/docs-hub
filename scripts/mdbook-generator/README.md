# Markdown Book Generator

This directory contains scripts for generating a consolidated markdown book from the documentation of various Fuel submodules.

## Files

- `generate-mdbook.mjs` - The main Node.js script that extracts and processes markdown files from all submodules
- `make-mdbook.sh` - A shell script that runs the generator and builds the book using mdbook

## Usage

To generate and build the markdown book:

```bash
# Make the script executable
chmod +x ./scripts/mdbook-generator/make-mdbook.sh

# Run the script
./scripts/mdbook-generator/make-mdbook.sh
```

This will:
1. Extract markdown files from all submodules
2. Process and organize them by category
3. Handle cross-references between documents
4. Generate a SUMMARY.md for navigation
5. Build the book using mdbook (if installed)

## Output

The generated markdown book will be available at:
- Source files: `./mdbook/`
- Built book: `./mdbook/book/`

## Requirements

- Node.js
- mdbook (will be auto-installed if cargo is available)

## Development

The script uses the existing `getDocs.mjs` function to locate and extract documents from each submodule. It preserves the original structure while organizing documents into a format suitable for mdbook.

To modify the script behavior:
- Edit `SUBMODULE_NAMES` to change the display names of submodules
- Modify the `processDocument` function to change document processing
- Update `generateSummary` to change the navigation structure 