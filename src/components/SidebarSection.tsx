/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton } from '@fuel-ui/react';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { useState } from 'react';

import type { VersionItem } from '../pages/[...slug]';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SectionProps = {
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book: string;
  docSlug: string | undefined;
  version?: VersionItem;
};

export function SidebarSection({
  links,
  onClick,
  book,
  docSlug,
  version,
}: SectionProps) {
  const [isOpened, setIsOpened] = useState<boolean | undefined>(
    book === 'guides' || docSlug?.includes(book.toLowerCase())
  );
  const isGuide = book === 'guides';
  const bookHasIndex =
    book?.toLowerCase().replaceAll(/[_-]/g, ' ') ===
    links[0].label.toLowerCase().replaceAll(/[_-]/g, ' ');

  function toggle() {
    setIsOpened((s) => !s);
  }

  function handleClick(e: any) {
    if (onClick) {
      onClick(e);
    }
    if (!isOpened) {
      setIsOpened(true);
    }
  }

  return (
    <>
      {!isGuide && (
        <Box.Flex justify={'space-between'}>
          <SidebarLink
            intent="base"
            size="md"
            data-bookmenu
            onClick={handleClick}
            item={{
              slug: links[0].slug,
              isExternal: false,
              label: book,
            }}
            isActiveMenu={docSlug?.replace('/latest/', '/') === links[0].slug}
          />
          <IconButton
            size="xs"
            aria-label="Button"
            intent="base"
            variant="link"
            onClick={toggle}
            icon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
          />
        </Box.Flex>
      )}

      {(isGuide || isOpened) && (
        <Box css={styles.listContainer}>
          <Box css={styles.line} />
          <Box.VStack gap="0" css={styles.sectionContainer}>
            {links.map((link: any, index: number) => {
              if (!bookHasIndex || index > 0) {
                if (link.slug) {
                  return (
                    <SidebarLink
                      onClick={onClick}
                      key={link.slug}
                      item={link}
                    />
                  );
                } else if (link.submenu) {
                  return (
                    <SidebarSubmenu
                      key={link.submenu[0].slug}
                      onClick={onClick}
                      {...link}
                    />
                  );
                }
              }
            })}
          </Box.VStack>
        </Box>
      )}
      {isOpened && version && (
        <Box css={styles.version}>Version: {version.version}</Box>
      )}
    </>
  );
}

const styles = {
  sectionContainer: cssObj({
    pl: '$4',
  }),
  listContainer: cssObj({
    position: 'relative',
    mt: '$2',
    mb: '$6',
  }),
  version: cssObj({
    fontSize: '$sm',
    pl: '$4',
    mb: '$8',
  }),
  listItem: cssObj({
    position: 'relative',
    listStyleType: 'none',
  }),
  line: cssObj({
    position: 'absolute',
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: '16.5px',
    width: '1px',
    backgroundColor: '$gray8',
  }),
};
