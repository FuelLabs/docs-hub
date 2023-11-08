import { Box } from '@fuel-ui/react';
import { useEffect, useState } from 'react';
import { Layout } from '~/src/components/Layout';
import { DocProvider } from '~/src/hooks/useDocContext';

import { Breadcrumb } from '../components/Breadcrumb';
import { DocFooter } from '../components/DocFooter';
import { MDXRender } from '../components/MDXRender';
import { useVersion } from '../hooks/useVersion';
import { getComponents } from '../lib/imports';
import type { DocPageProps } from '../pages/[...slug]';

export function DocScreen(props: DocPageProps) {
  const { doc, allNavs, allLatestNavs } = props;
  const [isLatest, setisLatest] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setisLatest(version === 'Latest' || doc.isLatest);
  }, [version, doc]);

  const components = getComponents(doc.slug, doc.isLatest);
  const navs = doc.originalSlug.includes('guides')
    ? undefined
    : isLatest
    ? allLatestNavs
    : allNavs;

  return (
    <DocProvider {...props}>
      <Layout
        title={doc?.title}
        isClean={false}
        config={doc.docsConfig}
        isLatest={isLatest}
        versions={isLatest ? props.latestVersions : props.versions}
        allNavs={navs}
      >
        <Box.Flex as="section" className="Layout--section">
          {doc && (
            <Box>
              <Breadcrumb />
              <MDXRender
                code={props.code}
                components={components}
                isLatest={isLatest}
              />
            </Box>
          )}
          {doc && <DocFooter />}
        </Box.Flex>
      </Layout>
    </DocProvider>
  );
}
