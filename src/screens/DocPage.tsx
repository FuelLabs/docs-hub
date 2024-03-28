import { Box } from '@fuel-ui/react';
import { useEffect, useState } from 'react';
import { Layout } from '~/src/components/Layout';
import { DocProvider } from '~/src/hooks/useDocContext';

import { Breadcrumb } from '../components/Breadcrumb';
import { DocFooter } from '../components/DocFooter';
import { MDXRender } from '../components/MDXRender';
import { useVersion } from '../hooks/useVersion';
import { getActiveNav } from '../lib/getActiveNav';
import { getComponents } from '../lib/imports';
import type { DocPageProps } from '../pages/[...slug]';
import type { VersionSet } from '../types';
import { GuidesPage } from './GuidesPage';

export function DocScreen(props: DocPageProps) {
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const { doc, allNavs, allNightlyNavs, allBeta4Navs } = props;
  const [versionSet, setVersionSet] = useState<VersionSet>('default');
  const version = useVersion();

  useEffect(() => {
    if (version === 'Nightly' || doc?.versionSet === 'nightly') {
      setVersionSet('nightly');
    } else if (version === 'Beta-4' || doc?.versionSet === 'beta-4') {
      setVersionSet('beta-4');
    } else {
      setVersionSet('default');
    }
  }, [version, doc]);

  useEffect(() => {
    if (versionSet === 'nightly') {
      setIsAlertVisible(true);
    }
  }, [versionSet]);

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

  const Doc = () => {
    if (doc && props.codeLight && props.codeDark) {
      const components = getComponents(doc.slug, doc.versionSet);
      return (
        <Box.Flex as='section' className='Layout--section'>
          {doc && (
            <Box>
              <Breadcrumb />
              <MDXRender
                codeLight={props.codeLight}
                codeDark={props.codeDark}
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
      );
    }
  };

  return (
    <DocProvider {...props}>
      <Layout
        title={props.guides ? 'Fuel Guides' : doc?.title}
        config={props.guides ? undefined : doc?.docsConfig}
        versionSet={versionSet}
        versions={versions}
        allNavs={navs}
        setIsAlertVisible={setIsAlertVisible}
        isAlertVisible={isAlertVisible}
      >
        {props.guides ? (
          <GuidesPage versionSet={versionSet} guides={props.guides} />
        ) : (
          <Doc />
        )}
      </Layout>
    </DocProvider>
  );
}
