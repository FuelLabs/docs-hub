import { cssObj } from '@fuel-ui/css';
import { Box, Button, Icon, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

interface SidebarSubmenuProps extends SidebarLinkItem {
  handleClick: Dispatch<SetStateAction<boolean>>;
}

export function SidebarSubmenu({
  label,
  hasIndex,
  submenu,
  subpath,
  handleClick,
}: SidebarSubmenuProps) {
  const pathname = usePathname();
  const [isOpened, setIsOpened] = useState<boolean>();
  const newLabel = label.replace(/\s+/g, '-').toLowerCase();
  let slug = `${subpath}/${newLabel}`;
  const pathnameSegments = pathname?.split('/');

  useEffect(() => {
    if (pathname.includes('/guides/')) {
      setIsOpened(true);
    } else {
      const pathArray = submenu![0].slug?.split('/');
      const index = pathArray?.indexOf(subpath!);
      const category = pathArray && index ? `/${pathArray[index + 1]}` : '';

      let active =
        pathnameSegments &&
        pathnameSegments[2] === subpath &&
        `/${pathnameSegments[3]}` === category;

      let foundPathInSubmenu = false;

      if (active && submenu) {
        for (let i = 0; i < submenu.length; i++) {
          const thisSlug = `/docs/${submenu[i].slug!.replace('./', '')}/`;
          if (pathname === thisSlug) {
            foundPathInSubmenu = true;
            break;
          }
        }
        if (!foundPathInSubmenu) active = false;
      }
      setIsOpened(active);
    }
  }, [pathname]);

  if (!hasIndex && submenu && submenu[0].slug) {
    slug = submenu[0].slug;
  }

  return (
    <Box.Flex css={styles.root}>
      <Box.Flex justify={'space-between'}>
        <SidebarLink
          intent="base"
          handleClick={handleClick}
          item={{ label, slug }}
          isActiveMenu={isOpened}
        />
        <Button
          onPress={() => setIsOpened(!isOpened)}
          css={styles.button}
          intent="base"
          size="xs"
        >
          <Icon
            icon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
          />
        </Button>
      </Box.Flex>

      {isOpened && (
        <List>
          {submenu?.map((item, index) => {
            if (
              item.label !== label ||
              (item.slug && item.slug.split('/').length > 3)
            ) {
              return (
                <List.Item key={index}>
                  <SidebarLink
                    handleClick={handleClick}
                    item={item}
                    data-submenu
                  />
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
  button: cssObj({
    background: 'transparent',
    '.fuel_Icon': {
      color: 'var(--colors-semanticLinkBaseIcon)',
    },
    '&:hover': {
      background: 'transparent !important',
    },
  }),
};
