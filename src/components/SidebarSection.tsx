/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton } from '@fuel-ui/react';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { useState } from 'react';

import type { Versions } from '../pages/[...slug]';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SectionProps = {
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book: string;
  docSlug: string | undefined;
  versions?: Versions;
};

export function SidebarSection({
  links,
  onClick,
  book,
  docSlug,
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

  return (
    <>
      {!isGuide && (
        <Box.Flex justify={'space-between'}>
          <SidebarLink
            intent="base"
            size="md"
            data-bookmenu
            onClick={onClick}
            item={{
              slug: links[0].slug,
              isExternal: false,
              label: book,
            }}
            isActiveMenu={false}
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
        //     {/* {version && (
        //         <Box css={{ fontSize: '$sm', padding: '20px 0 20px 0' }}>
        //           Version: {version.version}
        //         </Box>
        //       )} */}
        //   </Box.VStack>
      )}
    </>
  );
}

const styles = {
  sectionContainer: cssObj({
    pb: '$6',
    pl: '$4',
  }),
  listContainer: cssObj({
    position: 'relative',
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
