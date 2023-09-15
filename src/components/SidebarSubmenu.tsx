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
  subpath,
  onClick,
  isLatest,
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
      const actualBook = subpath?.replace('latest/', '');
      const index = pathArray?.indexOf(actualBook!);
      const category = pathArray && index ? `/${pathArray[index + 1]}` : '';
      const bookIndex = isLatest ? 3 : 2;
      const categoryIndex = isLatest ? 4 : 3;

      let active =
        pathnameSegments &&
        pathnameSegments[bookIndex] === actualBook &&
        `/${pathnameSegments[categoryIndex]}` === category;

      // TODO: is this needed?
      let foundPathInSubmenu = false;
      if (active && submenu) {
        for (let i = 0; i < submenu.length; i++) {
          const thisSlugPath = submenu[i].slug!.replace('./', '');
          const thisSlug = `/docs/${thisSlugPath}/`;
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
          onClick={onClick}
          item={{ label, slug }}
          isActiveMenu={isOpened}
          isLatest={isLatest}
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
            const length = isLatest ? 4 : 3;
            if (
              item.label !== label ||
              (item.slug && item.slug.split('/').length > length)
            ) {
              return (
                <List.Item key={index}>
                  <SidebarLink
                    isLatest={isLatest}
                    onClick={onClick}
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
};
