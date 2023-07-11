import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink, Icon } from '@fuel-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocContext } from '~/src/hooks/useDocContext';

import { styles as linkStyles, SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

export function Sidebar() {
  const { links } = useDocContext();
  const pathname = usePathname();
  return (
    links && (
      <Box.Stack as="nav" css={styles.root} className="Sidebar">
        {pathname.includes('/guides/') && (
          <ButtonLink
            as={NextLink}
            href={'/guides'}
            css={{ ...linkStyles.root, justifyContent: 'flex-start' }}
          >
            <Icon icon={Icon.is('ArrowBackUp')} stroke={1} color="textMuted" />
            Back to Guides
          </ButtonLink>
        )}
        {links.map((link, index) => {
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
