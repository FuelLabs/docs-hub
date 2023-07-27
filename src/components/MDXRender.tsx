/* eslint-disable @typescript-eslint/no-explicit-any */
import { runSync } from '@mdx-js/mdx';
import * as provider from '@mdx-js/react';
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
import { Table } from './Table';

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
} as any;

type MDXRenderProps = {
  code: string;
  components: Record<any, any>;
};

export function MDXRender({ code, components }: MDXRenderProps) {
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
