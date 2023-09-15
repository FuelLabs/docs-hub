import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink, Icon } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

import { styles as linkStyles, SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

interface SidebarProps {
  onClick?: ButtonLinkProps['onClick'];
  isLatest: boolean;
}

export function Sidebar({ onClick, isLatest }: SidebarProps) {
  const ctx = useDocContext();
  const { links, doc, versions } = ctx;
  const version =
    doc && doc.docsConfig ? versions[doc.docsConfig.title]?.version : null;

  return (
    links && (
      <Box.Stack as="nav" css={styles.root} className="Sidebar">
        {doc.parent && (
          <NextLink href={doc.parent.link} legacyBehavior passHref>
            <ButtonLink
              intent="base"
              css={{ ...linkStyles.root, justifyContent: 'flex-start' }}
            >
              <Icon
                icon={Icon.is('ArrowBackUp')}
                stroke={1}
                color="textMuted"
              />
              Back to {doc.parent.label}
            </ButtonLink>
          </NextLink>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {links.map((link: any, index: number) => {
          return link.slug ? (
            <SidebarLink
              isLatest={isLatest}
              onClick={onClick}
              key={link.slug}
              item={link}
            />
          ) : (
            <SidebarSubmenu
              onClick={onClick}
              key={link.subpath ? link.subpath + index : index}
              isLatest={isLatest}
              {...link}
            />
          );
        })}
        {version && (
          <Box css={{ fontSize: '$sm', padding: '20px 0 60px 0' }}>
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
