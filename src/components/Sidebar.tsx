import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useRouter } from 'next/router';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

import { useDocContext } from '~/src/hooks/useDocContext';

export function Sidebar() {
  const { links } = useDocContext();
  const router = useRouter();
  // console.log('ROUTER:', router.asPath.split('/')[2]);
  // console.log('LINKS', links[0]);
  return (
    <Box as="nav" css={styles.root}>
      {links.map((link) => {
        return link.slug ? (
          <>
            {router.asPath.split('/')[2] &&
              link.slug.includes(router.asPath.split('/')[2]) && (
                <SidebarLink key={link.slug} item={link} />
              )}
          </>
        ) : (
          <SidebarSubmenu key={link.subpath} {...link} />
        );
      })}
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
};
