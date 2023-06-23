import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

import { useDocContext } from '~/src/hooks/useDocContext';

export function Sidebar() {
  const { links } = useDocContext();
  return (
    <Box.Stack as="nav" css={styles.root} className="Sidebar">
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
  );
}

const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
  }),
};
