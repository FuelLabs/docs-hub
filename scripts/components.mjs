import fs from 'fs';
import { globby } from 'globby';
import path from 'path';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const DOCS_DIRECTORY = path.join(process.cwd(), './docs');

const OUTPUT_FOLDER = 'src/component-exports';

// const GRAPHQL_BOOK_NAME = 'fuel-graphql-docs';
// const GRAPHQL_DIRECTORY = path.join(DOCS_DIRECTORY, `./${GRAPHQL_BOOK_NAME}`);
// const GRAPHQL_DOCS_DIRECTORY = path.join(GRAPHQL_DIRECTORY, './docs');
// const GRAPHQL_COMPONENTS_CONFIG_PATH = path.join(
//   GRAPHQL_DIRECTORY,
//   './src/components.json'
// );

const WALLET_BOOK_NAME = 'fuels-wallet';
const WALLET_BOOK_PATH = `${WALLET_BOOK_NAME}/packages/docs`;
const WALLET_DIRECTORY = path.join(DOCS_DIRECTORY, `./${WALLET_BOOK_PATH}`);
const WALLET_DOCS_DIRECTORY = path.join(WALLET_DIRECTORY, './docs');
const WALLET_COMPONENTS_CONFIG_PATH = path.join(
  WALLET_DIRECTORY,
  './src/components.json'
);

async function main() {
  //   exportComponents(
  //     GRAPHQL_DIRECTORY,
  //     GRAPHQL_DOCS_DIRECTORY,
  //     GRAPHQL_PATH,
  //     GRAPHQL_COMPONENTS_CONFIG_PATH,
  //     'graphql.ts'
  //   );
  await exportComponents(
    WALLET_DIRECTORY,
    WALLET_DOCS_DIRECTORY,
    WALLET_BOOK_PATH,
    WALLET_COMPONENTS_CONFIG_PATH,
    'wallet.ts'
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
  return Array.from(new Set(components));
}

function findComponentsInMDXFiles(files, componentsConfig) {
  const components = {};
  let componentList = [];

  files.forEach((filePath) => {
    const mdxContent = fs.readFileSync(filePath, 'utf-8');
    const comps = getComponents(mdxContent);
    componentList = [
      ...componentList,
      ...comps.map((compName) => compName.split('.').pop()),
    ];
    if (comps.length > 0) {
      const fileName = filePath.split('/').pop()?.replace('.mdx', '');
      const final = [];
      const categories = {};

      comps.forEach((comp) => {
        if (comp.includes('.')) {
          const split = comp.split('.');
          const categoryComp = split.pop();
          const category = split.pop();
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(categoryComp);
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
        });
      });

      components[fileName] = final;
    }
  });
  return { components, componentList: Array.from(new Set(componentList)) };
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
  const { components, componentList } = findComponentsInMDXFiles(
    paths,
    componentsConfig
  );
  console.log('components', componentList);

  const completedObjects = [];
  const completedExports = [];

  const componentsString = `/* eslint-disable @typescript-eslint/no-explicit-any */
  import dynamic from "next/dynamic";
  import type { ComponentType } from "react";

  export interface ComponentObject {
    [key: string]: ComponentType<any>;
  }

  export interface Component {
    name: string;
    import?: ComponentType<any>;
    imports?: ComponentObject;
  }

  export interface ComponentsList {
    [key: string]: Component[];
  }

  ${Object.keys(components)
    .map((page) => {
      const pageArray = components[page];
      return pageArray
        .map((comp) => {
          if (comp.subComponents && comp.subComponents.length > 0) {
            const subComps = comp.subComponents
              .map((subComp) => {
                let actualCompPath = '';
                for (let i = 0; i < componentsConfig.folders.length; i++) {
                  const path = `${componentsConfig.folders[i]}/${subComp}`;
                  const actualPath = `${directory}${path}.tsx`;
                  if (fs.existsSync(actualPath)) {
                    actualCompPath = `../../docs/${dirPath}${path}`;
                    break;
                  }
                }
                if (actualCompPath === '') {
                  throw Error(`Can't find ${subComp}`);
                }

                if (!completedExports.includes(`${comp.name}.${subComp}`)) {
                  completedExports.push(`${comp.name}.${subComp}`);
                  return `${comp.name}.${subComp} = dynamic(
  () => import("${actualCompPath}").then((mod) => mod.${subComp})
);\n\n`;
                }
              })
              .join('');
            if (!completedObjects.includes(comp.name)) {
              const cat = `const ${comp.name}: ComponentObject= {};\n\n`;
              completedObjects.push(comp.name);
              return cat + subComps;
            }
            return subComps;
          } else {
            let actualCompPath = '';
            for (let i = 0; i < componentsConfig.folders.length; i++) {
              const path = `${componentsConfig.folders[i]}/${comp.name}`;
              const actualPath = `${directory}${path}.tsx`;
              if (fs.existsSync(actualPath)) {
                actualCompPath = `../../docs/${dirPath}${path}`;
                break;
              }
            }
            if (actualCompPath === '') {
              throw Error(`Can't find ${comp.name}`);
            }
            if (!completedExports.includes(comp.name)) {
              return `const ${comp.name} = dynamic(
  () => import("${actualCompPath}").then((mod) => mod.${comp.name})
);\n\n`;
            }
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
  fs.writeFileSync(outputPath, componentsString);
}
