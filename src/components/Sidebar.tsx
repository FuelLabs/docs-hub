import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink, Icon } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

import { styles as linkStyles, SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

export function Sidebar() {
  const ctx = useDocContext();
  const { links, doc, versions } = ctx;
  let version;
  if (doc.slug.includes('docs/fuels-rs')) {
    version = versions.rust.version;
  } else if (doc.slug.includes('docs/fuels-ts')) {
    version = versions.tsSDK.version;
  } else if (doc.slug.includes('docs/sway') || doc.slug.includes('docs/forc')) {
    version = versions.forc.version;
  } else if (doc.slug.includes('docs/indexer')) {
    version = versions.indexer.version;
  } else if (doc.slug.includes('docs/fuelup')) {
    version = versions.fuelup.version;
  } else if (doc.slug.includes('docs/wallet')) {
    version = versions.wallet.version;
  }
  return (
    links && (
      <Box.Stack as="nav" css={styles.root} className="Sidebar">
        {doc.parent && (
          <ButtonLink
            as={NextLink}
            href={doc.parent.link}
            css={{ ...linkStyles.root, justifyContent: 'flex-start' }}
          >
            <Icon icon={Icon.is('ArrowBackUp')} stroke={1} color="textMuted" />
            Back to {doc.parent.label}
          </ButtonLink>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {links.map((link: any, index: number) => {
          return link.slug ? (
            <SidebarLink key={link.slug + index} item={link} />
          ) : (
            <SidebarSubmenu
              key={link.subpath ? link.subpath + index : index}
              {...link}
            />
          );
        })}
        {version && (
          <Box css={{ fontSize: '$sm', paddingTop: '20px' }}>
            Version: {version}
          </Box>
        )}
      </Box.Stack>
    )
  );
}

const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
  }),
};
