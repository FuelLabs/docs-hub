/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Icon } from '@fuel-ui/react';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { useState } from 'react';
import type { VersionItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SectionProps = {
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book: string;
  bookName: string;
  docSlug: string | undefined;
  version?: VersionItem;
};

export function SidebarSection({
  links,
  onClick,
  book,
  bookName,
  docSlug,
  version,
}: SectionProps) {
  const [isOpened, setIsOpened] = useState<boolean | undefined>(
    book === 'guides' ||
      docSlug?.includes(book.toLowerCase()) ||
      (book === 'Intro' && docSlug?.includes('guides/quickstart/'))
  );
  const isGuide = book === 'guides';
  const bookHasIndex =
    book?.toLowerCase().replaceAll(/[_-]/g, ' ') ===
    links[0].label.toLowerCase().replaceAll(/[_-]/g, ' ');

  function toggle() {
    setIsOpened((s) => !s);
  }

  return (
    <>
      {!isGuide && (
        <Box.Flex justify={'space-between'}>
          <Button
            variant={'ghost'}
            href={links[0].slug}
            intent="base"
            onClick={toggle}
            css={styles.menuButton}
            rightIcon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
            iconSize={16}
          >
            {bookName}
          </Button>
        </Box.Flex>
      )}

      {(isGuide || isOpened) && (
        <Box css={styles.listContainer}>
          <Box css={styles.line} />
          <Box.VStack gap="0" css={styles.sectionContainer}>
            {links.map((link: any, index: number) => {
              if (link.slug) {
                return (
                  <SidebarLink
                    onClick={onClick}
                    key={link.slug}
                    item={link}
                    isIndex={index === 0 && bookHasIndex}
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
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12 !important',
    },
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
  menuButton: cssObj({
    bg: '$transparent',
    width: '100%',
    justifyContent: 'space-between',
    border: 'none',
    '&:hover': {
      bg: '$gray2 !important',
      border: 'none !important',
      fontWeight: '550',
    },
  }),
};
