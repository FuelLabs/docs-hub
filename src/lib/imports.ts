/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic';
import * as GQLExamples from '~/docs/fuel-graphql-docs/examples';
import * as FuelExamples from '~/docs/fuels-wallet/packages/docs/examples';
import TestAction from '~/src/components/TestAction';
import { COMPONENTS as GQL_COMPONENTS } from '~/src/generated/components/graphql';
import { COMPONENTS as WALLET_COMPONENTS } from '~/src/generated/components/wallet';

import type { DocType, ComponentsList } from '../types';

function loadComponent(imp: any, name?: string) {
  return dynamic(() => imp.then((mod: any) => (name ? mod[name] : mod)), {
    ssr: false,
  });
}

export function getComponents(doc: DocType) {
  const components: any = {};
  const slug = doc.docsConfig.slug || '';

  function addComponents(list: ComponentsList) {
    Object.keys(list).forEach((page) => {
      if (doc.slug.includes(page)) {
        list[page].forEach((comp: any) => {
          if (comp.import) {
            components[comp.name] = comp.import;
          } else if (comp.imports) {
            components[comp.name] = comp.imports;
          }
        });
      }
    });
  }

  if (['guides/'].some((s) => slug.startsWith(s))) {
    components.CodeImport = loadComponent(
      import('~/src/components/CodeImport'),
      'CodeImport'
    );
    components.TestAction = TestAction;
  } else if (['docs/wallet/'].some((s) => slug.startsWith(s))) {
    components.CodeImport = loadComponent(
      import('~/src/components/CodeImport'),
      'CodeImport'
    );

    addComponents(WALLET_COMPONENTS);

    components.Examples = FuelExamples;
  } else if (['docs/graphql/'].some((s) => slug.startsWith(s))) {
    components.GQLExamples = GQLExamples;
    components.CodeExamples = loadComponent(
      import('~/src/components/GraphqlCodeExample'),
      'GraphQLCodeExample'
    );
    addComponents(GQL_COMPONENTS);
  }

  return components;
}
