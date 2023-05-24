import { cssObj, cx } from '@fuel-ui/css';
import { Button, Flex, Icon, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SidebarLink } from './SidebarLink';

import type { SidebarLinkItem } from '~/src/types';

type SidebarSubmenuProps = SidebarLinkItem;

export function SidebarSubmenu({
  label,
  submenu,
  subpath,
}: SidebarSubmenuProps) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(`/docs/${subpath}`);
  const [isOpened, setIsOpened] = useState(Boolean(isActive));

  function toggle() {
    setIsOpened((s) => !s);
  }

  const newLabel = label.replace(/\s+/g, '-').toLowerCase();

  let slug = `${subpath}/${newLabel}`;
  if (newLabel === slug.split('/').pop() && subpath === 'sway') {
    slug = slug.concat('/index');
  }

  return (
    <Flex css={styles.root}>
      <Flex justify={'space-between'}>
        <SidebarLink item={{ label, slug }} />
        <Button
          variant="link"
          rightIcon={isOpened ? Icon.is('CaretUp') : Icon.is('CaretDown')}
          onPress={toggle}
          className={cx({ active: isActive })}
        />
      </Flex>
      {isOpened && (
        <List>
          {submenu?.map((item) => {
            if (item.label !== label) {
              return (
                <List.Item
                  key={item.slug}
                  icon={Icon.is('ArrowRight')}
                  iconSize={10}
                  iconColor="gray6"
                >
                  <SidebarLink item={item} />
                </List.Item>
              );
            }
            return <div key={item.slug} />;
          })}
        </List>
      )}
    </Flex>
  );
}

const styles = {
  root: cssObj({
    px: '$2',
    mt: '$2',
    flexDirection: 'column',

    '.fuel_button': {
      padding: '$0',
      justifyContent: 'space-between',
      color: '$gray10',
      fontWeight: '$normal',
    },
    '.fuel_button:focus': {
      outline: 'none',
      color: '$gray12',
    },
    '.fuel_button.active': {
      color: '$gray12',
    },
    '.fuel_button:hover': {
      color: '$gray11',
      textDecoration: 'none',
    },

    '.fuel_list': {
      display: 'flex',
      flexDirection: 'column',
      gap: '$1',
      mt: '$2',
    },
    '.fuel_list-item': {
      gap: '$2',
    },
    '.fuel_list-item a': {
      flex: 1,
    },
  }),
};
