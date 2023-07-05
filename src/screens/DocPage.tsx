import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import { getComponents } from '../imports';

import { Layout } from '~/src/components/Layout';
import { Sidebar } from '~/src/components/Sidebar';
import { TableOfContent } from '~/src/components/TableOfContent';
import { DocProvider } from '~/src/hooks/useDocContext';
import type { DocType, SidebarLinkItem } from '~/src/types';
import { DocFooter } from '../components/DocFooter';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
};

export function DocScreen(props: DocPageProps) {
  const { doc } = props;
  const components = getComponents(doc);
  const hasHeadings = Boolean(doc.headings.length);

  return (
    <DocProvider {...props}>
      <Layout title={doc.title}>
        <Box css={styles.sidebar}>
          <Box css={{ position: 'sticky', top: 20 }}>
            <Sidebar />
          </Box>
        </Box>
        <Box as="section" css={styles.section} className="Layout--section">
          <Box className="Layout--pageContent">
            <MDXRemote {...doc.source} scope={doc} components={components} />
          </Box>
          <DocFooter />
        </Box>
        {hasHeadings && <TableOfContent />}
      </Layout>
    </DocProvider>
  );
}

const styles = {
  sidebar: cssObj({
    display: 'none',
    padding: '$8 $8 $0 $6',
    position: 'sticky',
    borderRight: '1px solid $border',
    bg: '$overlayBg',
    top: 20,

    '@xl': {
      display: 'block',
    },
  }),
  section: cssObj({
    py: '$4',
    px: '$0',
    display: 'flex',
    flexDirection: 'column',

    '@md': {
      px: '$0',
    },

    '@xl': {
      py: '$14',
      px: '$0',
    },

    '& .fuel_Heading[data-rank="h1"]:first-of-type': {
      mt: '$0 !important',
    },

    '& .Layout--pageContent': {
      flex: 1,
    },
  }),
};
