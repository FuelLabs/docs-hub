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
import type { VersionSet } from '../types';
import { getActiveNav } from '../lib/getActiveNav';
import useTheme from '../hooks/useTheme';

export function DocScreen(props: DocPageProps) {
  const { doc, allNavs, allNightlyNavs, allBeta4Navs } = props;
  const [versionSet, setVersionSet] = useState<VersionSet>('default');
  const version = useVersion();
  const { theme } = useTheme();
  console.log('theme', theme);

  useEffect(() => {
    if (version === 'Nightly' || doc.versionSet === 'nightly') {
      setVersionSet('nightly');
    } else if (version === 'Beta-4' || doc.versionSet === 'beta-4') {
      setVersionSet('beta-4');
    } else {
      setVersionSet('default');
    }
  }, [version, doc]);

  const components = getComponents(doc.slug, doc.versionSet);
  const navs = getActiveNav(
    versionSet,
    allNavs,
    allNightlyNavs,
    allBeta4Navs,
    doc
  );

  let versions = props.versions;
  if (versionSet !== 'default') {
    if (versionSet === 'nightly') {
      versions = props.nightlyVersions;
    } else {
      versions = props.beta4Versions;
    }
  }

  return (
    <DocProvider {...props}>
      <Layout
        title={doc?.title}
        isClean={false}
        config={doc.docsConfig}
        versionSet={versionSet}
        versions={versions}
        allNavs={navs}
      >
        <Box.Flex as="section" className="Layout--section">
          {doc && (
            <Box>
              <Breadcrumb />
              <MDXRender
                code={theme === 'light' ? props.codeLight : props.codeDark}
                components={components}
                versionSet={versionSet}
                fuelCoreVersion={props.fuelCoreVersion}
                nodeVersion={props.nodeVersion}
                nodeVersionMax={props.nodeVersionMax}
              />
            </Box>
          )}
          {doc && <DocFooter />}
        </Box.Flex>
      </Layout>
    </DocProvider>
  );
}
