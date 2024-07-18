import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

interface SidebarSubmenuProps extends SidebarLinkItem {
  onClick?: ButtonLinkProps['onClick'];
}

export function SidebarSubmenu({
  label,
  isExternal,
  hasIndex,
  submenu,
  onClick,
}: SidebarSubmenuProps) {
  const thisItem = {
    label,
    slug: submenu![0].slug,
    isExternal,
    breadcrumbs: [],
  };

  return (
    <Box.Flex css={styles.root}>
      <SidebarLink
        intent='base'
        onClick={onClick}
        item={thisItem}
        isActiveMenu={true}
      />

      <List>
        {submenu?.map((item, index) => {
          if (!hasIndex || index > 0) {
            return (
              <List.Item key={index}>
                <SidebarLink onClick={onClick} item={item} data-submenu />
              </List.Item>
            );
          }
        })}
      </List>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',
  }),
};
