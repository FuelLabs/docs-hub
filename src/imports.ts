/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';

import { COMPONENTS as GQL_COMPONENTS } from './component-exports/graphql';
import { COMPONENTS as WALLET_COMPONENTS } from './component-exports/wallet';
import type { DocType, ComponentsList } from './types';

export function getComponents(doc: DocType) {
  const components: any = {};

  function addComponents(list: ComponentsList) {
    Object.keys(list).forEach((page) => {
      if (doc.slug.includes(page)) {
        list[page].forEach((comp) => {
          if (comp.import) {
            components[comp.name] = comp.import;
          } else if (comp.imports) {
            components[comp.name] = comp.imports;
          }
        });
      }
    });
  }

  if (['wallet', 'guides'].includes(doc.docsConfig.slug)) {
    const CodeImport = dynamic(() =>
      import('~/src/components/CodeImport').then((mod) => mod.CodeImport)
    );
    components.CodeImport = CodeImport;

    addComponents(WALLET_COMPONENTS);
  } else if (doc.docsConfig.slug === 'graphql') {
    const CodeExamples = dynamic(() =>
      import('~/src/components/GraphqlCodeExample').then(
        (mod) => mod.GraphQLCodeExample
      )
    );
    components.CodeExamples = CodeExamples;

    addComponents(GQL_COMPONENTS);
  }

  return components;
}
