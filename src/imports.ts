/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic';
import * as GQLExamples from '~/docs/fuel-graphql-docs/examples';
import * as FuelExamples from '~/docs/fuels-wallet/packages/docs/examples';

import type { DocType } from './types';

function loadComponent(imp: any, name?: string) {
  return dynamic(
    () => {
      return imp.then((mod: any) => {
        return name ? mod[name] : mod;
      });
    },
    {
      ssr: false,
    }
  );
}

export function getComponents(doc: DocType) {
  const components: any = {};
  const slug = doc.docsConfig.slug || '';

  if (['wallet/', 'guides/'].some((s) => slug.includes(s))) {
    components.CodeImport = loadComponent(
      import('~/src/components/CodeImport'),
      'CodeImport'
    );

    // load the components used in the wallet docs
    components.Demo = loadComponent(
      import('~/docs/fuels-wallet/packages/docs/src/components/Demo'),
      'Demo'
    );

    components.Player = loadComponent(
      import('~/docs/fuels-wallet/packages/docs/src/components/Player'),
      'Player'
    );

    components.InstallSection = loadComponent(
      import('~/docs/fuels-wallet/packages/docs/src/components/InstallSection'),
      'InstallSection'
    );

    components.ConnectionAlert = loadComponent(
      import(
        '~/docs/fuels-wallet/packages/docs/src/components/ConnectionAlert'
      ),
      'ConnectionAlert'
    );

    components.Examples = FuelExamples;
  }

  if (['graphql/', 'recipes/'].some((s) => slug.includes(s))) {
    components.GQLExamples = GQLExamples;
    components.CodeExamples = loadComponent(
      import('~/src/components/GraphqlCodeExample'),
      'GraphQLCodeExample'
    );
  }

  return components;
}
