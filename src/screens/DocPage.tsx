import { Box } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Breadcrumb } from '~/src/components/Breadcrumb';
import { Layout } from '~/src/components/Layout';
import { DocProvider } from '~/src/hooks/useDocContext';

import { DocFooter } from '../components/DocFooter';
import { MDXRender } from '../components/MDXRender';
import { useVersion } from '../hooks/useVersion';
import { getComponents } from '../lib/imports';
import type { DocPageProps } from '../pages/[...slug]';

export function DocScreen(props: DocPageProps) {
  const { doc, allNavs, allLatestNavs } = props;
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
  const navs = doc.slug.includes('guides')
    ? undefined
    : isLatest
    ? allLatestNavs
    : allNavs;

  return (
    <DocProvider {...props}>
      <Layout
        title={doc?.title}
        hasHeadings={hasHeadings}
        config={doc.docsConfig}
        category={doc.category}
        isLatest={isLatest}
        versions={props.versions}
        allNavs={navs}
      >
        <Box.Flex
          as="section"
          className="Layout--section"
          ref={scrollContainer}
        >
          {doc && (
            <Box className="Layout--pageContent">
              <Breadcrumb
                doc={doc}
                navLinks={props.links}
                isLatest={isLatest}
              />
              <MDXRender code={props.code} components={components} />
            </Box>
          )}
          {doc && <DocFooter />}
        </Box.Flex>
      </Layout>
    </DocProvider>
  );
}
