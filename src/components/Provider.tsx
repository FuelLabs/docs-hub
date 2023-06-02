/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { ThemeProvider } from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

// import { Examples, Components } from '../importer';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { CodeImport } from './CodeImport';
import { Heading } from './Heading';
import { Link } from './Link';
import { UL } from './List';
import { Paragraph } from './Paragraph';
import Player from './Player';
import { Pre } from './Pre';
import { Table } from './Table';

// TODO: make these imports dynamic
import * as Examples from '~/docs/fuels-wallet/packages/docs/examples/';
import { Demo } from '~/docs/fuels-wallet/packages/docs/src/components/Demo';
import { DownloadFuelWallet } from '~/docs/fuels-wallet/packages/docs/src/components/DownloadFuelWallet';

const components = {
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
  CodeImport,
  Player,
  // TODO: make these imports dynamic
  Demo,
  DownloadFuelWallet,
  Examples,
};

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <MDXProvider components={components as any}>
      <ThemeProvider>{children}</ThemeProvider>
    </MDXProvider>
  );
}
