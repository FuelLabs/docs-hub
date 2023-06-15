import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import { getComponents } from '../imports';

import { Layout } from '~/src/components/Layout';
import { Sidebar } from '~/src/components/Sidebar';
import { TableOfContent } from '~/src/components/TableOfContent';
import { DocProvider } from '~/src/hooks/useDocContext';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
};

export function DocScreen(props: DocPageProps) {
  const { doc } = props;

  const components = getComponents(doc);

  return (
    <DocProvider {...props}>
      <Layout title={doc.title}>
        <Box css={styles.sidebar}>
          <Box css={{ position: 'sticky', top: 20 }}>
            <Sidebar />
          </Box>
        </Box>
        <Box as="section" css={styles.section}>
          <MDXRemote {...doc.source} scope={doc} components={components} />
        </Box>
        <TableOfContent />
      </Layout>
    </DocProvider>
  );
}

const styles = {
  sidebar: cssObj({
    display: 'none',
    padding: '$8 $0 $0 $6',
    position: 'sticky',
    top: 20,

    '@xl': {
      display: 'block',
    },
  }),
  section: cssObj({
    py: '$4',
    px: '$4',

    '@md': {
      px: '$10',
    },

    '@xl': {
      py: '$8',
      px: '$0',
      width: '60vw',
    },
  }),
};
