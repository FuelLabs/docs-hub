/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic';
import * as GQLExamples from '~/docs/fuel-graphql-docs/examples';
import * as FuelExamples from '~/docs/fuels-wallet/packages/docs/examples';
import * as LatestGQLExamples from '~/docs/latest/fuel-graphql-docs/examples';
import * as LatestFuelExamples from '~/docs/latest/fuels-wallet/packages/docs/examples';
import { COMPONENTS as GQL_COMPONENTS } from '~/src/generated/components/graphql';
import { COMPONENTS as LATEST_GQL_COMPONENTS } from '~/src/generated/components/latest-graphql';
import { COMPONENTS as LATEST_WALLET_COMPONENTS } from '~/src/generated/components/latest-wallet';
import { COMPONENTS as WALLET_COMPONENTS } from '~/src/generated/components/wallet';

import type { VersionCtx } from '../hooks/useVersion';
import type { DocType, ComponentsList } from '../types';

function loadComponent(imp: any, name?: string) {
  return dynamic(() => imp.then((mod: any) => (name ? mod[name] : mod)), {
    ssr: false,
  });
}

export function getComponents(doc: DocType, version?: VersionCtx) {
  const components: any = {};
  const slug = doc.docsConfig.slug || '';
  const isLatest = version && version === 'latest';

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

  if (slug.includes('guides/')) {
    components.CodeImport = loadComponent(
      import('~/src/components/CodeImport'),
      'CodeImport'
    );
  } else if (
    slug.includes('docs/wallet') ||
    slug.includes('docs/latest/wallet')
  ) {
    components.CodeImport = loadComponent(
      import('~/src/components/CodeImport'),
      'CodeImport'
    );

    if (isLatest) {
      components.Examples = LatestFuelExamples;
      addComponents(LATEST_WALLET_COMPONENTS);
    } else {
      components.Examples = FuelExamples;
      addComponents(WALLET_COMPONENTS);
    }
  } else if (
    slug.includes('docs/graphql') ||
    slug.includes('docs/latest/graphql')
  ) {
    if (isLatest) {
      components.GQLExamples = LatestGQLExamples;
      addComponents(LATEST_GQL_COMPONENTS);
    } else {
      components.GQLExamples = GQLExamples;
      addComponents(GQL_COMPONENTS);
    }
    components.CodeExamples = loadComponent(
      import('~/src/components/GraphqlCodeExample'),
      'GraphQLCodeExample'
    );
  }

  return components;
}
