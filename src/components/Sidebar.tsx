import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink, Icon } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

import { styles as linkStyles, SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

export function Sidebar() {
  const { links, doc } = useDocContext();
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
