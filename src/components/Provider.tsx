/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThemeProvider, darkTheme, lightTheme } from '@fuel-ui/react';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';

import { Blockquote } from './Blockquote';
import { Code } from './Code';
import { Heading } from './Heading';
import { Link } from './Link';
import { UL, OL } from './List';
import { Paragraph } from './Paragraph';
import { Pre } from './Pre';
import { Table } from './Table';

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
  ol: OL,
};

type ProviderProps = {
  children: ReactNode;
  theme: string;
};

export function Provider({ children, theme }: ProviderProps) {
  return (
    <MDXProvider components={components as any}>
      <ThemeProvider
        themes={{ dark: darkTheme, light: lightTheme }}
        initialTheme={theme}
      >
        {children}
      </ThemeProvider>
    </MDXProvider>
  );
}
