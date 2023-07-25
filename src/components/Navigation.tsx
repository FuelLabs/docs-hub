import { cssObj, cx } from '@fuel-ui/css';
import { Dropdown, ButtonLink } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NAVIGATION } from '../constants';

export function Navigation({ active }: { active: string }) {
  const router = useRouter();

  return (
    <>
      {NAVIGATION.map((item, index) => {
        if (item.type === 'menu') {
          const isActive = item.menu?.some((i) => i.slug === active);
          return (
            <Dropdown key={index}>
              <Dropdown.Trigger>
                <ButtonLink
                  css={styles.navButton}
                  variant="link"
                  data-active={isActive}
                >
                  {item.name}
                </ButtonLink>
              </Dropdown.Trigger>
              <Dropdown.Menu
                autoFocus
                css={styles.menu}
                disabledKeys={item.categories}
                aria-label={item.name}
                onAction={(action) => {
                  if (item.menu) {
                    const menuItem = item.menu.find(
                      (i) => action === i.name.concat(i.type)
                    );
                    if (menuItem && menuItem.link) {
                      if (menuItem.type === 'internal-link') {
                        router.push(menuItem.link);
                      } else if (menuItem.type === 'external-link') {
                        window.open(menuItem.link);
                      }
                    }
                  }
                }}
              >
                {item.menu?.map((menuItem) => {
                  return (
                    <Dropdown.MenuItem
                      data-active={active === menuItem.slug}
                      css={styles.nestedLink}
                      className={cx({
                        active: active === menuItem.slug,
                        isCategory: menuItem.type === 'category',
                      })}
                      key={
                        menuItem.type === 'category'
                          ? menuItem.name
                          : menuItem.name.concat(menuItem.type)
                      }
                      textValue={menuItem.name}
                    >
                      {menuItem.name}
                    </Dropdown.MenuItem>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          );
        }
        return (
          <ButtonLink
            key={index}
            as={Link}
            href={item.link}
            css={styles.navButton}
            variant="link"
            data-active={active === item.name.toLowerCase()}
          >
            {item.name}
          </ButtonLink>
        );
      })}
    </>
  );
}

export const styles = {
  menu: cssObj({
    boxShadow: '$sm',
  }),
  nestedLink: cssObj({
    padding: '$0 $4',
    height: '$7',
    minHeight: 'auto',

    '&.active': {
      color: '$textLink',
    },
    '&.isCategory': {
      borderBottom: '1px solid $border',
      mb: '$1',
    },
  }),
  navButton: cssObj({
    color: '$intentsBase10',

    '&:not([aria-disabled="true"]):active, &:not([aria-disabled="true"])[aria-pressed="true"]':
      {
        outline: 'none',
        outlineOffset: 'none',
        outlineColor: 'transparent',
        transform: 'none',
      },

    '&:hover': {
      textDecoration: 'none',
      color: '$intentsBase12 !important',
    },

    '&[data-active="true"], &[data-active="true"]:hover': {
      color: '$textLink !important',
    },
  }),
};
