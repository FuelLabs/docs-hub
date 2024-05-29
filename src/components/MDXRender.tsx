import { Box } from '@fuel-ui/react';
import { runSync } from '@mdx-js/mdx';
import * as provider from '@mdx-js/react';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';
import { useEffect, useMemo, useState } from 'react';

import {
  BETA_5_EXPLORER_LINK,
  BETA_5_FAUCET_LINK,
  BETA_5_PLAYGROUND_LINK,
  BRIDGE_LINK,
  EXPLORER_LINK,
  FAUCET_LINK,
  FUEL_TESTNET,
  PLAYGROUND_LINK,
} from '../config/constants';
import { runtime } from '../lib/runtime';
import type { VersionSet } from '../types';

import useTheme from '../hooks/useTheme';
import { Blockquote } from './Blockquote';
import { CardSection } from './CardSection';
import { Code } from './Code';
import { CodeTabs } from './CodeTabs';
import { ConditionalContent } from './ConditionalContent';
import { Divider } from './Divider';
import { Heading } from './Heading';
import { Link } from './Link';
import { OL, UL } from './List';
import { Paragraph } from './Paragraph';
import { Pre } from './Pre';
import { QuickstartCards } from './QuickstartCards';
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
  CodeTabs,
  ConditionalContent,
  QuickstartCards,
  // biome-ignore lint/suspicious/noExplicitAny:
} as any;

type MDXRenderProps = {
  codeLight: string;
  codeDark: string;
  // biome-ignore lint/suspicious/noExplicitAny:
  components: Record<any, any>;
  versionSet: VersionSet;
  fuelCoreVersion?: string;
  nodeVersion?: string;
  nodeVersionMax?: string;
};

export function MDXRender({
  codeLight,
  codeDark,
  components,
  versionSet,
  fuelCoreVersion,
  nodeVersion,
  nodeVersionMax,
}: MDXRenderProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme } = useTheme();

  const { default: Content } = useMemo(
    () =>
      runSync(isMounted && theme === 'light' ? codeLight : codeDark, {
        ...runtime,
        ...provider,
      }),
    [codeDark, codeLight, theme, isMounted]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <provider.MDXProvider components={{ ...components, ...mdxComponents }}>
      <Content
        versionSet={versionSet}
        fuelTestnet={FUEL_TESTNET}
        fuelTestnetInlineCode={<Code>{FUEL_TESTNET}</Code>}
        faucetLink={
          <Link href={FAUCET_LINK}>
            <Code>{FUEL_TESTNET}</Code> faucet
          </Link>
        }
        faucetUrl={FAUCET_LINK}
        explorerUrl={EXPLORER_LINK}
        bridgeUrl={BRIDGE_LINK}
        GQLPlaygroundLink={
          <Link href={PLAYGROUND_LINK}>
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
