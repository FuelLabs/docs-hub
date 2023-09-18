import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, Icon, IconButton, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

interface SidebarSubmenuProps extends SidebarLinkItem {
  onClick?: ButtonLinkProps['onClick'];
  isLatest: boolean;
}

export function SidebarSubmenu({
  label,
  hasIndex,
  submenu,
  isExternal,
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
      const actualSlug = `/${thisItem.slug}/`;
      const active = pathname.startsWith(actualSlug);
      setIsOpened(active);
    }
  }, [pathname]);

  return (
    <Box.Flex css={styles.root}>
      <Box.Flex justify={'space-between'}>
        <SidebarLink
          intent="base"
          onClick={onClick}
          item={thisItem}
          isActiveMenu={isOpened}
        />
        <IconButton
          size="xs"
          aria-label="Button"
          intent="base"
          variant="link"
          onClick={() => setIsOpened(!isOpened)}
          icon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
        />
      </Box.Flex>

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
            return <div key={index} />;
          })}
        </List>
      )}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',

    '.fuel_List': {
      display: 'flex',
      flexDirection: 'column',
      gap: '$1',
      mt: '$1',
      pl: '$3',
      ml: '$1',
      borderLeft: '1px solid $border',
    },
    '.fuel_ListItem': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '$0',
    },
    '.fuel_ListItem a': {
      display: 'block',
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
};
