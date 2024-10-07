import { cssObj } from '@fuel-ui/css';
import { Box, Button, ButtonLink, Icon } from '@fuel-ui/react';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { useState } from 'react';
import type { VersionItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SectionProps = {
  // biome-ignore lint/suspicious/noExplicitAny:
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
    (book.toLowerCase() === 'guides' && docSlug?.includes('guides')) ||
      docSlug?.includes(`/${book.toLowerCase()}/`) ||
      docSlug === `docs/${book.toLowerCase()}` ||
      (book === 'Intro' && !docSlug)
  );

  const isGuide = book === 'guides';
  const bookHasIndex =
    book?.toLowerCase().replaceAll(/[_-]/g, ' ') ===
    links[0].label.toLowerCase().replaceAll(/[_-]/g, ' ');

  let githubLink = '';
  if (!version && book !== 'Intro') {
    switch (book) {
      case 'GraphQL':
        githubLink = 'https://github.com/FuelLabs/fuel-core/tree/v0.27.0';
        break;
      case 'Specs':
        githubLink = 'https://github.com/FuelLabs/fuel-specs';
        break;
      case 'Sway-libs':
        githubLink = 'https://github.com/FuelLabs/sway-libs';
        break;
      case 'Sway-standards':
        githubLink = 'https://github.com/FuelLabs/sway-standards';
        break;
      case 'Sway-by-example-lib':
        githubLink = 'https://github.com/FuelLabs/sway-by-example-lib';
        break;
      case 'Migrations-and-disclosures':
        githubLink = 'https://github.com/FuelLabs/migrations-and-disclosures';
        break;
      case 'Fuel-book':
        githubLink = 'https://github.com/FuelLabs/fuel-book';
        break;
      case 'Guides':
        githubLink = 'https://github.com/FuelLabs/docs-hub';
        break;
      case 'Integration-docs':
        githubLink = 'https://github.com/FuelLabs/integration-docs';
        break;
      default:
        break;
    }
  }

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
            intent='base'
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
          <Box.VStack gap='0' css={styles.sectionContainer}>
            {/* biome-ignore lint/suspicious/noExplicitAny: */}
            {links.map((link: any, index: number) => {
              if (link.submenu) {
                return (
                  <SidebarSubmenu
                    key={link.submenu[0].slug}
                    onClick={onClick}
                    {...link}
                  />
                );
              }
              if (link.slug) {
                return (
                  <SidebarLink
                    onClick={onClick}
                    key={link.slug}
                    item={link}
                    isIndex={index === 0 && bookHasIndex}
                  />
                );
              }
            })}
          </Box.VStack>
        </Box>
      )}
      {isOpened && book !== 'Intro' && book !== 'guides' && (
        <ButtonLink
          href={version ? version.url : githubLink}
          leftIcon={'BrandGithubFilled'}
          size={'sm'}
          css={styles.version}
          isExternal
        >
          {version && <>Version: {version.version}</>}
        </ButtonLink>
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
  icon: cssObj({
    color: '$intentsBase10',
    'html[class="fuel_light-theme"] &': {
      color: '$gray11',
    },
    '&:hover': {
      color: '$accent8',
    },
  }),
  version: cssObj({
    fontSize: '$sm',
    pl: '$4',
    mb: '$8',
    color: '$semanticLinkBaseColor !important',
    '.fuel_Icon': {
      color: '$semanticLinkBaseColor !important',
    },
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12 !important',
      '.fuel_Icon': {
        color: '$intentsBase12 !important',
      },
    },
    '[aria-label*="Icon Link"]': {
      display: 'none',
    },
    '&:hover': {
      'html[class="fuel_light-theme"] &': {
        color: '#009957 !important',
        '.fuel_Icon': {
          color: '#009957 !important',
        },
      },
      'html[class="fuel_dark-theme"] &': {
        color: '$semanticLinkPrimaryColor !important',
        '.fuel_Icon': {
          color: '$semanticLinkPrimaryColor !important',
        },
      },

      textDecoration: 'none !important',
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
    '&:active': {
      transform: 'scale(1) !important',
    },
  }),
};
