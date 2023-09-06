/* eslint-disable @typescript-eslint/no-explicit-any */
import 'plyr-react/plyr.css';
import { Box } from '@fuel-ui/react';
import { runSync } from '@mdx-js/mdx';
import * as provider from '@mdx-js/react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { runtime } from '../lib/runtime';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { Divider } from './Divider';
import { Heading } from './Heading';
import { Link } from './Link';
import { UL, OL } from './List';
import { Paragraph } from './Paragraph';
import { Pre } from './Pre';
import { Table, TD, TH } from './Table';

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
} as any;

type MDXRenderProps = {
  code: string;
  components: Record<any, any>;
};

export function MDXRender({ code, components }: MDXRenderProps) {
  const pathname = usePathname();
  if (pathname.startsWith('/docs/wallet/')) {
    components.td = TD;
    components.th = TH;
  }

  const { default: Content } = useMemo(
    () => runSync(code, { ...runtime, ...provider }),
    [code]
  );

  return (
    <provider.MDXProvider components={{ ...components, ...mdxComponents }}>
      <Content />
    </provider.MDXProvider>
  );
}
