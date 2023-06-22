import { cssObj } from '@fuel-ui/css';
import { Dropdown, Button, Link } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { NAVIGATION } from '../constants';
import type { Tabs } from '../constants';

export function Navigation() {
  const [active, setActive] = useState<Tabs>('portal');
  const router = useRouter();

  useEffect(() => {
    let category = 'portal';
    if (router.pathname !== '/') {
      category = router.asPath.split('/docs/')[1].split('/')[0];
    }
    if (isStringInTabs(category)) setActive(category as Tabs);
  }, [router]);

  function isStringInTabs(str: string): boolean {
    return (
      str === 'portal' ||
      str === 'sway' ||
      str === 'fuels-rs' ||
      str === 'fuels-ts' ||
      str === 'wallet' ||
      str === 'graphql' ||
      str === 'fuelup' ||
      str === 'indexer' ||
      str === 'specs' ||
      str === 'forc'
    );
  }

  return (
    <>
      {NAVIGATION.map((item, index) => {
        if (item.type === 'menu') {
          return (
            <Dropdown key={index}>
              <Dropdown.Trigger>
                <Button css={styles.navButton} variant={'outlined'}>
                  {item.name}
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu
                autoFocus
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
                      css={
                        menuItem.type === 'category'
                          ? styles.breakLine
                          : active === menuItem.slug
                          ? {
                              ...styles.activeTopNavLink,
                              ...styles.nestedLink,
                            }
                          : styles.nestedLink
                      }
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
          <Link key={index} href={item.link}>
            <Button css={styles.navButton} variant="link">
              {item.name}
            </Button>
          </Link>
        );
      })}
    </>
  );
}

const styles = {
  nestedLink: {
    padding: '4px 16px',
  },
  activeTopNavLink: {
    background: 'var(--colors-accent2)',
  },
  breakLine: cssObj({
    borderBottom: '2px solid $accent10',
    fontSize: '16px',
    color: '#86ffcb',
  }),
  navButton: cssObj({
    borderRadius: '8px',
  }),
};
