import { Box } from '@fuel-ui/react';
import { Breadcrumb } from '~/src/components/Breadcrumb';
import { Layout } from '~/src/components/Layout';
// import { Sidebar } from '~/src/components/Sidebar';
import { TableOfContent } from '~/src/components/TableOfContent';
import { DocProvider } from '~/src/hooks/useDocContext';

import { AltSidebar } from '../components/AltSidebar';
import { DocFooter } from '../components/DocFooter';
import { MDXRender } from '../components/MDXRender';
import { getComponents } from '../lib/imports';
import type { DocPageProps } from '../pages/[...slug]';

import { styles } from './HomePage';

export function DocScreen(props: DocPageProps) {
  const { doc, allNavs } = props;
  const components = getComponents(doc);
  const hasHeadings = Boolean(doc?.headings?.length);

  return (
    <DocProvider {...props}>
      <Layout
        title={doc?.title}
        hasHeadings={hasHeadings}
        config={doc.docsConfig}
        category={doc.category}
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
        <Box as="section" css={styles.section} className="Layout--section">
          {doc && (
            <Box className="Layout--pageContent">
              <Breadcrumb doc={doc} navLinks={props.links} />
              <MDXRender code={props.code} components={components} />
            </Box>
          )}
          {doc && <DocFooter />}
        </Box>
        {doc && hasHeadings && <TableOfContent />}
      </Layout>
    </DocProvider>
  );
}
