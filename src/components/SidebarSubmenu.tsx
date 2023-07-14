import { cssObj } from '@fuel-ui/css';
import { Box, Icon, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

type SidebarSubmenuProps = SidebarLinkItem;

export function SidebarSubmenu({
  label,
  hasIndex,
  submenu,
  subpath,
}: SidebarSubmenuProps) {
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState<boolean>();
  const newLabel = label.replace(/\s+/g, '-').toLowerCase();
  let slug = `${subpath}/${newLabel}`;

  useEffect(() => {
    const pathArray = submenu![0].slug?.split('/');
    const index = pathArray?.indexOf(subpath!);
    const category = pathArray && index ? `/${pathArray[index + 1]}` : '';
    const active = pathname?.startsWith(`/docs/${subpath}${category}/`);
    setIsOpened(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!hasIndex && submenu && submenu[0].slug) {
    slug = submenu[0].slug;
  }

  return (
    <Box.Flex css={styles.root}>
      <SidebarLink
        item={{ label, slug }}
        rightIcon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
      />
      {isOpened && (
        <List>
          {submenu?.map((item, index) => {
            if (item.label !== label) {
              return (
                <List.Item key={index}>
                  <SidebarLink item={item} data-submenu />
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
