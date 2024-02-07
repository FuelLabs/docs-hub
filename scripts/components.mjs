import * as acornLoose from 'acorn-loose';
import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import * as prettier from 'prettier';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const DOCS_DIRECTORY = path.join(process.cwd(), './docs');
const OUTPUT_FOLDER = 'src/generated/components';

// GRAPHQL DOCS COMPONENTS
const GRAPHQL_BOOK_NAME = 'fuel-graphql-docs';
const GRAPHQL_DIRECTORY = path.join(DOCS_DIRECTORY, `./${GRAPHQL_BOOK_NAME}`);
const GRAPHQL_DOCS_DIRECTORY = path.join(GRAPHQL_DIRECTORY, './docs');
const GRAPHQL_COMPONENTS_CONFIG_PATH = path.join(
  GRAPHQL_DIRECTORY,
  './src/components.json'
);

// NIGHTLY GRAPHQL DOCS COMPONENTS
const NIGHTLY_GRAPHQL_DIRECTORY = path.join(
  DOCS_DIRECTORY,
  `./nightly/${GRAPHQL_BOOK_NAME}`
);
const NIGHTLY_GRAPHQL_DOCS_DIRECTORY = path.join(
  NIGHTLY_GRAPHQL_DIRECTORY,
  './docs'
);
const NIGHTLY_GRAPHQL_COMPONENTS_CONFIG_PATH = path.join(
  NIGHTLY_GRAPHQL_DIRECTORY,
  './src/components.json'
);

// BETA-4 GRAPHQL DOCS COMPONENTS
const BETA_4_GRAPHQL_DIRECTORY = path.join(
  DOCS_DIRECTORY,
  `./beta-4/${GRAPHQL_BOOK_NAME}`
);
const BETA_4_GRAPHQL_DOCS_DIRECTORY = path.join(
  BETA_4_GRAPHQL_DIRECTORY,
  './docs'
);
const BETA_4_GRAPHQL_COMPONENTS_CONFIG_PATH = path.join(
  BETA_4_GRAPHQL_DIRECTORY,
  './src/components.json'
);

// WALLET COMPONENTS
const WALLET_BOOK_NAME = 'fuels-wallet';
const WALLET_PATH = path.join(DOCS_DIRECTORY, WALLET_BOOK_NAME);
const WALLET_DIRECTORY = path.join(
  DOCS_DIRECTORY,
  `./${WALLET_BOOK_NAME}/packages/docs`
);
const WALLET_DOCS_DIRECTORY = path.join(WALLET_DIRECTORY, './docs');
const WALLET_COMPONENTS_CONFIG_PATH = path.join(
  WALLET_DIRECTORY,
  './src/components.json'
);

// NIGHTLY WALLET COMPONENTS
const NIGHTLY_WALLET_PATH = path.join(
  DOCS_DIRECTORY,
  `nightly/${WALLET_BOOK_NAME}`
);
const NIGHTLY_WALLET_DIRECTORY = path.join(
  DOCS_DIRECTORY,
  `./nightly/${WALLET_BOOK_NAME}/packages/docs`
);
const NIGHTLY_WALLET_DOCS_DIRECTORY = path.join(
  NIGHTLY_WALLET_DIRECTORY,
  './docs'
);
const NIGHTLY_WALLET_COMPONENTS_CONFIG_PATH = path.join(
  NIGHTLY_WALLET_DIRECTORY,
  './src/components.json'
);

// BETA-4 WALLET COMPONENTS
const BETA_4_WALLET_PATH = path.join(
  DOCS_DIRECTORY,
  `beta-4/${WALLET_BOOK_NAME}`
);
const BETA_4_WALLET_DIRECTORY = path.join(
  DOCS_DIRECTORY,
  `./beta-4/${WALLET_BOOK_NAME}/packages/docs`
);
const BETA_4_WALLET_DOCS_DIRECTORY = path.join(
  BETA_4_WALLET_DIRECTORY,
  './docs'
);
const BETA_4_WALLET_COMPONENTS_CONFIG_PATH = path.join(
  BETA_4_WALLET_DIRECTORY,
  './src/components.json'
);

const completedExports = [];
const completedObjects = [];

async function main() {
  if (!fs.existsSync(path.join(process.cwd(), OUTPUT_FOLDER))) {
    fs.mkdirSync(path.join(process.cwd(), OUTPUT_FOLDER), { recursive: true });
  }
  // GRAPHQL DOCS COMPONENTS
  await exportComponents(
    GRAPHQL_DIRECTORY,
    GRAPHQL_DOCS_DIRECTORY,
    GRAPHQL_BOOK_NAME,
    GRAPHQL_COMPONENTS_CONFIG_PATH,
    'graphql.ts'
  );
  // NIGHTLY GRAPHQL DOCS COMPONENTS
  await exportComponents(
    NIGHTLY_GRAPHQL_DIRECTORY,
    NIGHTLY_GRAPHQL_DOCS_DIRECTORY,
    `nightly/${GRAPHQL_BOOK_NAME}`,
    NIGHTLY_GRAPHQL_COMPONENTS_CONFIG_PATH,
    'nightly-graphql.ts'
  );
  // BETA-4 GRAPHQL DOCS COMPONENTS
  await exportComponents(
    BETA_4_GRAPHQL_DIRECTORY,
    BETA_4_GRAPHQL_DOCS_DIRECTORY,
    `beta-4/${GRAPHQL_BOOK_NAME}`,
    BETA_4_GRAPHQL_COMPONENTS_CONFIG_PATH,
    'beta-4-graphql.ts'
  );
  // WALLET COMPONENTS
  await exportComponents(
    WALLET_PATH,
    WALLET_DOCS_DIRECTORY,
    WALLET_BOOK_NAME,
    WALLET_COMPONENTS_CONFIG_PATH,
    'wallet.ts'
  );
  // NIGHTLY WALLET COMPONENTS
  await exportComponents(
    NIGHTLY_WALLET_PATH,
    NIGHTLY_WALLET_DOCS_DIRECTORY,
    `nightly/${WALLET_BOOK_NAME}`,
    NIGHTLY_WALLET_COMPONENTS_CONFIG_PATH,
    'nightly-wallet.ts'
  );
  // BETA-4 WALLET COMPONENTS
  await exportComponents(
    BETA_4_WALLET_PATH,
    BETA_4_WALLET_DOCS_DIRECTORY,
    `beta-4/${WALLET_BOOK_NAME}`,
    BETA_4_WALLET_COMPONENTS_CONFIG_PATH,
    'beta-4-wallet.ts'
  );
}

main();

async function getMDXFilesFromFolder(folderPath) {
  const paths = await globby(['**.mdx'], {
    cwd: folderPath,
  });
  return paths.map((thisPath) => path.join(folderPath, thisPath));
}

function getComponents(mdxContent) {
  const components = [];
  const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

  visit(tree, 'mdxJsxFlowElement', (node) => {
    components.push(node.name);
  });

  // catch inline components
  visit(tree, 'mdxJsxTextElement', (node) => {
    if (!htmlElements.includes(node.name)) {
      components.push(node.name);
    }
  });
  return Array.from(new Set(components));
}

function findComponentsInMDXFiles(files, componentsConfig) {
  const components = {};

  files.forEach((filePath) => {
    const mdxContent = fs.readFileSync(filePath, 'utf-8');
    const comps = getComponents(mdxContent);
    if (comps.length > 0) {
      const fileName = filePath.split('/').pop()?.replace('.mdx', '');
      const final = [];
      const categories = {};
      const subcategories = {};

      comps.forEach((comp) => {
        if (comp.includes('.')) {
          const split = comp.split('.');
          if (!componentsConfig.ignore.includes(split[0])) {
            // handle nested components
            if (split.length == 2) {
              const categoryComp = split.pop();
              const category = split.pop();
              if (!categories[category]) {
                categories[category] = [];
              }
              categories[category].push(categoryComp);
            } else if (split.length == 3) {
              const categoryComp = split.pop();
              const subCategory = split.pop();
              const category = split.pop();
              if (!subcategories[category]) {
                subcategories[category] = {};
              }
              if (!subcategories[category][subCategory]) {
                subcategories[category][subCategory] = [];
              }
              subcategories[category][subCategory].push(categoryComp);
            }
          }
        } else {
          // ignore components that are replaced in the docs hub
          if (!componentsConfig.ignore.includes(comp)) {
            final.push({
              name: comp,
            });
          }
        }
      });

      Object.keys(categories).forEach((cat) => {
        final.push({
          name: cat,
          subComponents: categories[cat],
          subCategories: subcategories[cat],
        });
      });

      if (final.length > 0) {
        components[fileName] = final;
      }
    }
  });
  return components;
}

function hasDefaultExport(componentPath) {
  const fileContent = fs.readFileSync(componentPath, 'utf8');

  const ast = acornLoose.parse(fileContent, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
  let isDefault = false;
  visit(ast, '', (node) => {
    if (node.body) {
      node.body.forEach((bodyNode) => {
        if (bodyNode.type === 'ExportDefaultDeclaration') {
          isDefault = true;
        }
      });
    }
  });
  return isDefault;
}

function getPath(compName, componentsConfig, directory, dirPath) {
  let actualCompPath = '';
  let isDefault = false;
  for (let i = 0; i < componentsConfig.folders.length; i++) {
    const thisPath = `${componentsConfig.folders[i]}/${compName}`;
    const actualPath = `${directory}${thisPath}.tsx`;
    if (fs.existsSync(actualPath)) {
      isDefault = hasDefaultExport(actualPath);
      actualCompPath = `~/docs/${dirPath}${thisPath}`;
      break;
    }
  }
  if (actualCompPath === '') {
    throw Error(`Can't find ${compName}`);
  }

  return { actualCompPath, isDefault };
}

function handleSubCategory(
  key,
  comp,
  componentsConfig,
  directory,
  dirPath,
  subCategories
) {
  const importName = `${comp.name}.${key}`;
  let categories = subCategories;
  if (!completedObjects.includes(importName)) {
    completedObjects.push(importName);
    categories = categories + `${importName} = {};\n\n`;
  }

  const subCatComps = comp.subCategories[key];
  categories =
    categories +
    subCatComps
      .map((subCatComp) => {
        const { actualCompPath, isDefault } = getPath(
          subCatComp,
          componentsConfig,
          directory,
          dirPath
        );

        const id = `${comp.name}.${key}.${subCatComp}`;
        if (!completedExports.includes(id)) {
          completedExports.push(id);
          return `${id} = dynamic(
      () => import("${actualCompPath}")${
            isDefault ? '' : `.then((mod) => mod.${subCatComp})`
          })
    ;\n\n`;
        }
      })
      .join('\n');
  return categories;
}

function handleSubComponents(comp, componentsConfig, directory, dirPath) {
  let subCategories = '';
  const subComps = comp.subComponents
    .map((subComp) => {
      const { actualCompPath, isDefault } = getPath(
        subComp,
        componentsConfig,
        directory,
        dirPath
      );

      if (!completedExports.includes(`${comp.name}.${subComp}`)) {
        completedExports.push(`${comp.name}.${subComp}`);
        return `${comp.name}.${subComp} = dynamic(
    () => import("${actualCompPath}")${
          isDefault ? '' : `.then((mod) => mod.${subComp})`
        })
  ;\n\n`;
      }
    })
    .join('');

  if (comp.subCategories) {
    Object.keys(comp.subCategories).forEach((key) => {
      subCategories =
        subCategories +
        handleSubCategory(
          key,
          comp,
          componentsConfig,
          directory,
          dirPath,
          subCategories
        );
    });
  }
  if (!completedObjects.includes(comp.name)) {
    const cat = `const ${comp.name}: ComponentObject= {};\n\n`;
    completedObjects.push(comp.name);
    return cat + subComps + subCategories;
  }
  return subComps + subCategories;
}

function handleComponent(comp, componentsConfig, directory, dirPath) {
  // handle component with no subComponents
  const { actualCompPath, isDefault } = getPath(
    comp.name,
    componentsConfig,
    directory,
    dirPath
  );

  if (!completedExports.includes(comp.name)) {
    return `const ${comp.name} = dynamic(
() => import("${actualCompPath}")${
      isDefault ? '' : `.then((mod) => mod.${comp.name})`
    })
;\n\n`;
  }
}

function getImports(components) {
  const includesDynamic = `import dynamic from "next/dynamic";`;
  const includesObject = `import type { ComponentObject, ComponentsList } from '~/src/types';`;
  const noObject = `import type { ComponentsList } from '~/src/types';`;
  let hasObject = false;
  let hasDynamic = false;

  const pages = Object.keys(components);
  if (pages.length > 0) {
    hasDynamic = true;
    Object.keys(components).forEach((key) => {
      if (!hasObject) {
        const pageArray = components[key];
        hasObject = pageArray.some(
          (comp) =>
            (comp.subComponents && comp.subComponents.length > 0) ||
            comp.subCategories
        );
      }
    });
  }

  if (hasObject) {
    return includesDynamic + includesObject;
  } else if (hasDynamic) {
    return includesDynamic + noObject;
  }
  return noObject;
}

async function exportComponents(
  directory,
  docsDirectory,
  dirPath,
  configPath,
  fileName
) {
  const componentsConfigFile = fs.readFileSync(configPath, 'utf8');
  const componentsConfig = JSON.parse(componentsConfigFile);

  const paths = await getMDXFilesFromFolder(docsDirectory);
  const components = findComponentsInMDXFiles(paths, componentsConfig);

  const componentsString = `// NOTE: This file is auto-generated by scripts/components.mjs
  ${getImports(components)}
  
  ${Object.keys(components)
    .map((page) => {
      const pageArray = components[page];
      return pageArray
        .map((comp) => {
          if (
            (comp.subComponents && comp.subComponents.length > 0) ||
            comp.subCategories
          ) {
            return handleSubComponents(
              comp,
              componentsConfig,
              directory,
              dirPath
            );
          } else {
            return handleComponent(comp, componentsConfig, directory, dirPath);
          }
        })
        .join('\n');
    })
    .join('\n')}
    export const COMPONENTS: ComponentsList = {
      ${Object.keys(components)
        .map((page) => {
          return `'${page}': [
      ${components[page]
        .map((comp) => {
          return `  {
    name: "${comp.name}",
    ${comp.subComponents ? 'imports:' : 'import:'} ${comp.name}
  },`;
        })
        .join('\n')}
  ],`;
        })
        .join('\n')}
  };
      `;
  const outputPath = path.join(OUTPUT_FOLDER, fileName);
  const formatted = prettier
    .format(componentsString, { parser: 'babel-ts' })
    .trimEnd();
  fs.writeFileSync(outputPath, formatted);
}

const htmlElements = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
];
