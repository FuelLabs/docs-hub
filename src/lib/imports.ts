/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import * as GQLExamples from '~/docs/fuel-graphql-docs/examples';
import * as FuelExamples from '~/docs/fuels-wallet/packages/docs/examples';
import * as LatestGQLExamples from '~/docs/latest/fuel-graphql-docs/examples';
import * as LatestFuelExamples from '~/docs/latest/fuels-wallet/packages/docs/examples';
import { TD, TH } from '~/src/components/Table';
import TestAction from '~/src/components/TestAction';
import { COMPONENTS as GQL_COMPONENTS } from '~/src/generated/components/graphql';
import { COMPONENTS as LATEST_GQL_COMPONENTS } from '~/src/generated/components/latest-graphql';
import { COMPONENTS as LATEST_WALLET_COMPONENTS } from '~/src/generated/components/latest-wallet';
import { COMPONENTS as WALLET_COMPONENTS } from '~/src/generated/components/wallet';

import type { ComponentsList } from '../types';

function loadComponent(imp: any, name?: string): ComponentType<object> {
  return dynamic(() => imp.then((mod: any) => (name ? mod[name] : mod)), {
    ssr: false,
  });
}

type Component = React.ComponentType<any>;

export interface ComponentsObject {
  [key: string]:
    | Component
    | typeof GQLExamples
    | typeof FuelExamples
    | typeof LatestGQLExamples
    | typeof LatestFuelExamples;
}

export function getComponents(docSlug: string, isLatest: boolean) {
  const components: ComponentsObject = {};

  function addComponents(list: ComponentsList) {
    Object.keys(list).forEach((page) => {
      if (docSlug.includes(page)) {
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

  if (docSlug.includes('guides/')) {
    components.TestAction = TestAction;
  } else if (
    docSlug.includes('docs/wallet') ||
    docSlug.includes('docs/latest/wallet')
  ) {
    components.td = TD;
    components.th = TH;

    if (isLatest) {
      components.Examples = LatestFuelExamples;
      addComponents(LATEST_WALLET_COMPONENTS);
    } else {
      components.Examples = FuelExamples;
      addComponents(WALLET_COMPONENTS);
    }
  } else if (
    docSlug.includes('docs/graphql') ||
    docSlug.includes('docs/latest/graphql')
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
