# Documentation Hub Integration Action Plan

## Project Overview

We need to integrate documentation from multiple submodules into a cohesive documentation hub. Each submodule has its own unique documentation structure, as defined in the `getDocs.mjs` file. This plan outlines our approach to systematizing, parsing, and integrating these documents.

## Goals

1. Create a unified documentation system from all submodules
2. Understand and preserve the unique structure of each submodule
3. Generate a clean, consistent documentation format
4. Establish a sustainable integration process for future updates

## Key Principle: Keep It Simple

This project should be approached with simplicity as a guiding principle. The primary goal is to extract the .md files from each submodule while preserving their existing structure, and compile them into a clean markdown book for review. We are not seeking to create a complex system but rather a straightforward, organized compilation of the existing documentation.

## Submodules to Process

The following submodules will be processed (ignoring nightly versions for now):

1. **Sway Language** - `./sway/docs/book/src/**/*.md` (excluding SUMMARY.md and forc directories)
2. **Forc (Fuel Orchestrator)** - `./sway/docs/book/src/forc/**/*.md` (excluding SUMMARY.md)
3. **Sway Libraries** - `./sway-libs/docs/book/src/**/*.md` (excluding SUMMARY.md)
4. **Sway Standards** - `./sway-standards/docs/src/**/*.md` (excluding SUMMARY.md)
5. **Sway by Example** - `./sway-by-example-lib/docs/src/**/*.md` (excluding SUMMARY.md)
6. **Migrations and Disclosures** - `./migrations-and-disclosures/docs/src/**/*.md` (excluding SUMMARY.md)
7. **Verified Addresses** - `./verified-addresses/docs/src/**/*.md` (excluding SUMMARY.md)
8. **Fuel Token Overview** - `./fuel-token-overview/docs/src/**/*.md` (excluding SUMMARY.md)
9. **Fuel Book** - `./fuel-book/docs/src/**/*.md` (excluding SUMMARY.md)
10. **Integration Docs** - `./integration-docs/docs/src/**/*.md` (excluding SUMMARY.md)
11. **Node Operator** - `./node-operator/docs/src/**/*.md` (excluding SUMMARY.md)
12. **Fuels-rs (Rust SDK)** - `./fuels-rs/docs/src/**/*.md` (excluding SUMMARY.md)
13. **Fuels-ts (TypeScript SDK)** - `./fuels-ts/apps/docs/src/**/*.md` and `./fuels-ts/apps/docs/src/**/*.md`
14. **Specs** - `./fuel-specs/src/**/*.md` (excluding SUMMARY.md)
15. **Guides** - `./guides/docs/**/*.md` (excluding .mdx files and SUMMARY.md)
16. **Intro** - Convert `./intro/*.mdx` files to .md format
17. **Contributing** - Convert `./contributing/*.mdx` files to .md format

## Directory Structure Details

Each submodule has its own unique structure for documentation. Here's a more detailed overview:

### Rust-based Projects (Sway, Forc, Sway-libs, Fuels-rs, Specs)

These projects typically use mdbook for documentation, with docs located in:

- `docs/book/src/` or
- `docs/src/` directories

### TypeScript-based Projects (Fuels-ts)

Documentation is located in:

- `apps/docs/src/` directory

### Simple Documentation Directories

Several modules have a straightforward structure with docs in:

- `docs/src/` directory

### MDX-based Documentation (Intro, Contributing, Guides)

These modules use .mdx format which will need conversion to .md for mdbook:

- Located in root directories like `./intro/`, `./contributing/`, and `./guides/docs/`

## Extraction Process Details

For each submodule, we need to:

1. **Locate Documentation**: Use the paths defined above to find all relevant markdown files.
2. **Handle Directory Structure**:
   - For mdbook projects, preserve the hierarchical structure as much as possible
   - For flat directory structures, create appropriate categories based on subdirectories
3. **Process Front Matter**:
   - Extract and normalize metadata (title, category, etc.)
   - Add original_path property to track source
4. **Handle Special Files**:
   - Skip SUMMARY.md files as these will be generated dynamically
   - Generate appropriate index files from README.md or index.md files where needed
5. **Cross-reference Management**:
   - Map all original file paths to new paths
   - Update relative links to point to the correct files in the new structure

## Preserving Original Navigation Structure

Most submodules in the Fuel ecosystem use mdbook with a SUMMARY.md file that defines their navigation structure. Our current approach flattens this structure, losing the original organization and hierarchy. To preserve the intended reading flow and organization:

1. **Parse Original SUMMARY.md Files**:

   - For each submodule, locate and parse its SUMMARY.md file (e.g., `./sway/docs/book/src/SUMMARY.md`)
   - Extract the hierarchical structure and page ordering
   - Create a mapping between original links in SUMMARY.md and our new file locations

2. **Maintain Hierarchical Structure**:

   - Preserve the chapter/section hierarchy from the original SUMMARY.md
   - Create a unified SUMMARY.md that mirrors the original structures within each submodule section
   - Support multiple levels of nesting using proper Markdown indentation

3. **Respect Original Ordering**:

   - Use the ordering defined in the original SUMMARY.md files
   - Apply consistent ordering for submodules that lack a SUMMARY.md

4. **Special Case Handling**:
   - Handle index pages and introductory content appropriately
   - Process section headers and separator lines
   - Map links with or without .md extensions consistently

This approach will create a more intuitive and familiar navigation structure for users already familiar with individual documentation sites, while still unifying everything under one documentation hub.

## File Transformation Rules

1. **File Path Transformation**:

   - Replace directory separators for nested paths: `dir/subdir/file.md` → `dir_subdir_file.md`
   - Preserve meaningful directory structure by using it for categories
   - Ensure unique filenames across the entire documentation set

2. **MDX to MD Conversion**:

   - Convert MDX-specific syntax to standard markdown
   - Extract and process JSX components appropriately
   - Preserve code blocks and other markdown elements

3. **File Content Processing**:
   - Add consistent front matter
   - Update relative links
   - Handle special cases like code examples and diagrams

## Clarification Questions

1. Should we handle GraphQL and Wallet documentation even though they use .mdx files?
2. Are there specific formatting requirements for the final compiled documentation?
3. ✅ Do we need to handle cross-references between documents? **Yes, cross-references must be preserved and maintained.**
4. ✅ Should we preserve the current category structure or create a new one? **We will preserve the current structure - each submodule will be its own category.**
5. ✅ Do we need to generate a new navigation structure? **No new navigation structure is needed. Each submodule being its own category is sufficient.**

## Implementation Plan

### Phase 1: Analysis and Preparation (1-2 days)

1. **Initial Assessment**

   - Examine sample documents from each submodule
   - Identify commonalities and differences in structure and formatting
   - Document any special handling requirements

2. **Setup Integration Environment**
   - Create necessary scripts directory structure
   - Set up simple extraction and compilation process
   - Define clean markdown book output format

### Phase 2: Document Processing Implementation (2-3 days)

1. **Core Processing Logic**

   - Implement document reading and extraction logic
   - Handle front matter processing consistently
   - Maintain existing structure within each submodule

2. **Submodule-Specific Logic**

   - Implement simple handling for each submodule's unique structure
   - Address category and title generation logic
   - Handle special cases (READMEs, index files, etc.)

3. **Cross-Reference Management**

   - Develop a system to identify and track cross-references between documents
   - Create a mapping system for old references to new document locations
   - Implement automated updating of cross-references during integration

4. **Validation and Testing**
   - Validate extracted documents against original sources
   - Test with documents from all submodules
   - Verify cross-references remain intact and functional

### Phase 3: Integration and Refinement (1-2 days)

1. **Integration Pipeline**

   - Implement simple end-to-end extraction pipeline
   - Add basic logging and error handling
   - Create clean markdown book output

2. **Structure Organization**

   - Organize documents by submodule categories
   - Ensure proper categorization matches original structure
   - Handle cross-references between documents

3. **Quality Assurance**
   - Check for broken links and cross-references
   - Ensure consistent formatting
   - Validate the compiled markdown book

### Phase 4: Finalization (1 day)

1. **Final Review**

   - Review compiled markdown book
   - Fix any remaining issues
   - Prepare for handoff

2. **Documentation and Handoff**
   - Document the simple extraction system
   - Provide the clean markdown book for review
   - Document how to add or update submodules in the future

## Technical Approach

1. **Document Location Strategy**:

   - Use the path patterns defined above for each submodule
   - Implement a recursive directory scanning approach
   - Skip explicitly excluded files (SUMMARY.md, etc.)

2. **Document Processing Pipeline**:

   - Scan: Locate all relevant markdown files
   - Extract: Read file content and metadata
   - Transform: Process content, update links, convert formats if needed
   - Output: Write to the appropriate location in the mdbook structure

3. **Cross-Reference Management**:

   - Create a global mapping of original paths to new paths
   - Process all documents to update links according to this mapping
   - Handle special cases like links to sections within documents

4. **MdBook Structure Generation**:
   - Create book.toml with appropriate metadata
   - Generate SUMMARY.md based on the processed documents
   - Organize documents by submodule categories

## SUMMARY.md Processing Implementation

1. **SUMMARY.md Parser**:

   - Implement a parser that understands Markdown list nesting and headers
   - Extract the hierarchical structure and links from each SUMMARY.md
   - Create a data structure that represents the hierarchy and ordering

2. **Link Mapping**:

   - Create a bidirectional map between original SUMMARY.md links and our new file paths
   - Handle relative links and links with or without file extensions
   - Resolve any link conflicts or duplicates

3. **Hierarchy Generation**:

   - Generate appropriate Markdown for nested lists in the final SUMMARY.md
   - Use headers for top-level submodule categories
   - Use nested lists with proper indentation for the internal structure

4. **Fallback Mechanism**:
   - For submodules without a SUMMARY.md, generate a flat list based on file discovery
   - Sort items alphabetically or by a logical order derived from filenames or metadata

## Execution Steps

1. **Preparation**:

   - Ensure all submodules are correctly cloned in the `docs` directory
   - Set up the mdbook output directory structure

2. **Document Extraction**:

   - Run extraction for each submodule using the appropriate path pattern
   - Apply the transformation rules consistently
   - Generate the document mapping

3. **Link Processing**:

   - Update all cross-references based on the document mapping
   - Verify link integrity

4. **MdBook Generation**:

   - Create the final mdbook structure
   - Generate SUMMARY.md and other required files
   - Build the book using the mdbook tool

5. **Validation**:
   - Verify all documents are correctly included
   - Check for broken links
   - Ensure proper categorization and organization

## Fixing Path Flattening and SUMMARY.md Structure

The current implementation attempts to use original `SUMMARY.md` files but fails due to path flattening in the output (`mdbook/src`) directory, leading to broken links and incorrect structure. The following steps will rectify this:

1. **Preserve Directory Structure:**

   - Modify `generate-mdbook.mjs` (`processDocument` and the loop building `linkMap`) to stop flattening filenames (e.g., `submodule_dir_file.md`).
   - Instead, replicate the original directory structure from the submodule's documentation source within `mdbook/src/<submodule>/`. For example, `docs/sway/docs/book/src/intro/getting-started.md` should become `mdbook/src/sway/intro/getting-started.md`.
   - Update the `linkMap` to store these preserved, structured paths.

2. **Correct Directory Creation:**

   - Ensure `fs.mkdirSync` in `processDocument` correctly creates nested directories within `mdbook/src/<submodule>/` as needed by the preserved paths.

3. **Accurate Link Rewriting:**

   - Revise the internal link updating logic within `processDocument`. It must:
     - Resolve the original relative link target based on the _original_ document's path.
     - Find the _new_ path of the target document using the updated `linkMap`.
     - Calculate the correct _new relative path_ from the current document's _new location_ to the target document's _new location_.
     - Use this new relative path in the updated link.

4. **Reliable SUMMARY.md Generation:**
   - Simplify the path resolution logic within `generateStructuredSummary`.
   - Resolve links from the original `SUMMARY.md` relative to their source directory.
   - Use the `linkMap` to find the corresponding new, structured path within `mdbook/src`.
   - Use these direct, structured paths (relative to `mdbook/src`) in the generated `SUMMARY.md`.

## Next Steps

1. Begin with Phase 1 and provide initial analysis report
2. Proceed with the simple extraction and compilation approach
3. Deliver clean markdown book for review

## Resource Requirements

- Software engineers familiar with JavaScript/Node.js
- Access to all submodule repositories
- Basic markdown book format specifications
- Cross-reference validation tools
