import { cssObj, cx } from '@fuel-ui/css';
import { Dropdown, ButtonLink, Icon } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { NAVIGATION } from '../config/constants';

interface NavigationProps {
  active: string;
  isLatest: boolean;
}

export function Navigation({ active, isLatest }: NavigationProps) {
  const router = useRouter();

  return (
    <>
      {NAVIGATION.map((item, index) => {
        if (item.type === 'menu') {
          const isActive = item.menu?.some((i) => i.slug === active);
          return (
            <Dropdown key={index}>
              <Dropdown.Trigger asChild>
                <ButtonLink css={styles.navButton} data-active={isActive}>
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
                        const thisLink = isLatest
                          ? menuItem.link.replace('docs/', 'docs/latest/')
                          : menuItem.link;
                        router.push(thisLink);
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
                      {menuItem.type === 'external-link' && (
                        <Icon icon={Icon.is('Link')} size={14} />
                      )}
                    </Dropdown.MenuItem>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          );
        }
        return (
          <NextLink
            key={index}
            href={
              isLatest
                ? item.link?.replace('docs/', 'docs/latest/')
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item.link as any)
            }
            legacyBehavior
            passHref
          >
            <ButtonLink
              css={styles.navButton}
              data-active={active === item.name.toLowerCase()}
            >
              {item.name}
            </ButtonLink>
          </NextLink>
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

    '&:hover': {
      textDecoration: 'none',
      color: '$intentsBase12 !important',
    },

    '&[data-active="true"], &[data-active="true"]:hover': {
      color: '$textLink !important',
    },
  }),
};
