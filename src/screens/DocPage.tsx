import { Box } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Breadcrumb } from '~/src/components/Breadcrumb';
import { Layout } from '~/src/components/Layout';
// import { Sidebar } from '~/src/components/Sidebar';
import { TableOfContent } from '~/src/components/TableOfContent';
import { DocProvider } from '~/src/hooks/useDocContext';

import { AltSidebar } from '../components/AltSidebar';
import { DocFooter } from '../components/DocFooter';
import { MDXRender } from '../components/MDXRender';
import { useVersion } from '../hooks/useVersion';
import { getComponents } from '../lib/imports';
import type { DocPageProps } from '../pages/[...slug]';

import { styles } from './HomePage';

export function DocScreen(props: DocPageProps) {
  const { doc, allNavs } = props;
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();
  const router = useRouter();
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted) {
      setIsMounted(true);
    }
    // Reset scroll view position when route changes
    scrollContainer.current?.scrollTo(0, 0);
  }, [router.asPath]);

  const isLatest = mounted ? version === 'Latest' : doc.isLatest;
  const components = getComponents(doc.slug, doc.isLatest);
  const hasHeadings = Boolean(doc.headings?.length);

  return (
    <DocProvider {...props}>
      <Layout
        title={doc?.title}
        hasHeadings={hasHeadings}
        config={doc.docsConfig}
        category={doc.category}
        isLatest={isLatest}
      >
        <Box css={styles.sidebar}>
          <Box css={styles.sidebarContainer}>
            {/* <Sidebar
              allNavs={doc.slug.includes('guides') ? undefined : allNavs}
            /> */}
            <AltSidebar
              versions={props.versions}
              allNavs={doc.slug.includes('guides') ? undefined : allNavs}
            />
          </Box>
        </Box>
        <Box.Flex as="section" css={styles.section} className="Layout--section">
          {doc && (
            <Box className="Layout--pageContent">
              <Breadcrumb doc={doc} navLinks={props.links} />
              <MDXRender code={props.code} components={components} />
            </Box>
          )}
          {doc && <DocFooter />}
        </Box.Flex>
        {doc && hasHeadings && <TableOfContent isLatest={isLatest} />}
      </Layout>
    </DocProvider>
  );
}

// const styles = {
//   sidebar: cssObj({
//     display: 'none',
//     padding: '$8 $8 $0 $6',
//     position: 'sticky',
//     borderRight: '1px solid $border',
//     bg: '$cardBg',
//     top: 20,

//     '@xl': {
//       display: 'block',
//     },
//   }),
//   sidebarContainer: cssObj({
//     position: 'sticky',
//     overflowX: 'auto',
//     '&::-webkit-scrollbar': {
//       display: 'none',
//     },
//   }),
//   section: cssObj({
//     padding: '$2',
//     position: 'sticky',
//     height: 'calc(100vh - 65px)',
//     overflowY: 'auto',
//     scrollBehavior: 'smooth',
//     '&::-webkit-scrollbar': {
//       display: 'none',
//     },

//     '@xl': {
//       pb: '$14',
//       px: '$0',
//     },

//     '& .fuel_Heading[data-rank="h1"]:first-of-type': {
//       mt: '$0 !important',
//     },

//     '& .Layout--pageContent': {
//       flex: 1,
//     },
//   }),
// };
