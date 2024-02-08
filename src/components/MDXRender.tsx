/* eslint-disable @typescript-eslint/no-explicit-any */
import 'plyr-react/plyr.css';
import { Box } from '@fuel-ui/react';
import { runSync } from '@mdx-js/mdx';
import * as provider from '@mdx-js/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import {
  BRIDGE_LINK,
  EXPLORER_LINK,
  BETA_4_EXPLORER_LINK,
  FAUCET_LINK,
  BETA_4_FAUCET_LINK,
  FUEL_TESTNET,
  PLAYGROUND_LINK,
  BETA_4_PLAYGROUND_LINK,
} from '../config/constants';
import { runtime } from '../lib/runtime';
import type { VersionSet } from '../types';

import { Blockquote } from './Blockquote';
import { CardSection } from './CardSection';
import { Code } from './Code';
import { CodeTabs } from './CodeTabs';
import { Divider } from './Divider';
import { Heading } from './Heading';
import { Link } from './Link';
import { UL, OL } from './List';
import { Paragraph } from './Paragraph';
import { Pre } from './Pre';
import { QuickstartCallout } from './QuickstartCallout';
import { Table } from './Table';

const Player = dynamic(() => import('./Player'), {
  ssr: false,
});

export const mdxComponents = {
  a: Link,
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  pre: Pre,
  p: Paragraph,
  code: Code,
  blockquote: Blockquote,
  table: Table,
  ul: UL,
  ol: OL,
  hr: Divider,
  Box,
  Player,
  CardSection,
  QuickstartCallout,
  CodeTabs,
} as any;

type MDXRenderProps = {
  code: string;
  components: Record<any, any>;
  versionSet: VersionSet;
  fuelCoreVersion?: string;
  nodeVersion?: string;
  nodeVersionMax?: string;
};

export function MDXRender({
  code,
  components,
  versionSet,
  fuelCoreVersion,
  nodeVersion,
  nodeVersionMax,
}: MDXRenderProps) {
  const { default: Content } = useMemo(
    () => runSync(code, { ...runtime, ...provider }),
    [code]
  );

  return (
    <provider.MDXProvider components={{ ...components, ...mdxComponents }}>
      <Content
        versionSet={versionSet}
        fuelTestnet={versionSet === 'beta-4' ? 'beta-4' : FUEL_TESTNET}
        fuelTestnetInlineCode={<Code>{FUEL_TESTNET}</Code>}
        faucetLink={
          <Link
            href={versionSet === 'beta-4' ? BETA_4_FAUCET_LINK : FAUCET_LINK}
          >
            <Code>{versionSet === 'beta-4' ? 'beta-4' : FUEL_TESTNET}</Code>{' '}
            faucet
          </Link>
        }
        faucetUrl={versionSet === 'beta-4' ? BETA_4_FAUCET_LINK : FAUCET_LINK}
        explorerUrl={
          versionSet === 'beta-4' ? BETA_4_EXPLORER_LINK : EXPLORER_LINK
        }
        bridgeUrl={BRIDGE_LINK}
        GQLPlaygroundLink={
          <Link
            href={
              versionSet === 'beta-4' ? BETA_4_PLAYGROUND_LINK : PLAYGROUND_LINK
            }
          >
            <Code>{FUEL_TESTNET}</Code> graphQL playground
          </Link>
        }
        fuelCoreVersion={<Code>{fuelCoreVersion}</Code>}
        nodeVersion={<Code>{nodeVersion}</Code>}
        nodeVersionMax={<Code>{nodeVersionMax}</Code>}
      />
    </provider.MDXProvider>
  );
}
