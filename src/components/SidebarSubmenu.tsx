import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState<boolean>();

  const thisItem = {
    label,
    slug: submenu![0].slug,
    isExternal,
  };

  useEffect(() => {
    if (pathname.includes('/guides/')) {
      setIsOpened(true);
    } else {
      let actualSlug = thisItem.slug;
      if (!hasIndex) {
        const split = thisItem.slug.split('/');
        split.pop();
        actualSlug = split.join('/');
      }
      const active = pathname.startsWith(`/${actualSlug}/`);
      setIsOpened(active);
    }
  }, [pathname]);

  return (
    <Box.Flex css={styles.root}>
      <SidebarLink
        intent="base"
        onClick={onClick}
        item={thisItem}
        isActiveMenu={isOpened}
      />

      {isOpened && (
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
      )}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',
  }),
};
