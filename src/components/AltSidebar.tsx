import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink, Button } from '@fuel-ui/react';
import { useState } from 'react';

import { useDocContext } from '../hooks/useDocContext';
import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';
import type { SidebarLinkItem } from '../types';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SidebarProps = {
  allNavs?: NavOrder[];
  onClick?: ButtonLinkProps['onClick'];
  parent?: {
    label: string;
    link: string;
  };
  links?: SidebarLinkItem[];
  versions?: Versions;
};

type SectionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book: string;
  docSlug: string | undefined;
  versions?: Versions;
};

function SidebarSection({ links, onClick, book, docSlug }: SectionProps) {
  const [isOpened, setIsOpened] = useState<boolean | undefined>(
    book === 'guides' || docSlug?.includes(book.toLowerCase())
  );
  const isGuide = book === 'guides';

  function toggle() {
    setIsOpened((s) => !s);
  }
  return (
    <>
      {!isGuide && (
        <Button
          onClick={toggle}
          css={
            isOpened
              ? {
                  ...styles.button,
                  ...styles.sectionLink,
                  ...styles.activeSectionLink,
                }
              : { ...styles.button, ...styles.sectionLink }
          }
          variant="link"
          intent="base"
          size="lg"
        >
          {book}
        </Button>
      )}

      {(isGuide || isOpened) && (
        <Box css={styles.sectionContainer}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {links.map((link: any, index: number) => {
            return link.slug ? (
              <SidebarLink onClick={onClick} key={link.slug} item={link} />
            ) : (
              <SidebarSubmenu
                onClick={onClick}
                key={link.subpath ? link.subpath + index : index}
                {...link}
              />
            );
          })}
          {/* {version && (
            <Box css={{ fontSize: '$sm', padding: '20px 0 20px 0' }}>
              Version: {version.version}
            </Box>
          )} */}
        </Box>
      )}
    </>
  );
}

export function AltSidebar({ allNavs, onClick, versions }: SidebarProps) {
  const ctx = useDocContext();
  const { links, doc } = ctx;

  return (
    <Box.Stack as="nav" css={styles.root} className="Sidebar">
      {!allNavs && (
        <>
          {doc.parent && (
            <ButtonLink
              href={doc.parent.link}
              intent={'base'}
              leftIcon={'ArrowNarrowLeft'}
              css={styles.button}
              size={'sm'}
            >
              {doc.parent.label}
            </ButtonLink>
          )}
          <SidebarSection
            book="guides"
            links={links}
            onClick={onClick}
            docSlug={doc && doc.slug}
          />
        </>
      )}

      {allNavs &&
        allNavs.map((navOrder) => (
          <Box key={navOrder.key}>
            <SidebarSection
              book={navOrder.key}
              links={navOrder.links}
              onClick={onClick}
              docSlug={doc && doc.slug}
              versions={versions}
            />
          </Box>
        ))}
    </Box.Stack>
  );
}

export const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
    lineHeight: '1.3',
  }),
  sectionContainer: cssObj({
    pb: '$4',
  }),
  button: cssObj({
    width: '100%',
    justifyContent: 'flex-start',
    py: '$2',
    '&:hover': {
      bg: '$intentsBase3 !important',
    },
  }),
  sectionLink: cssObj({
    '&:hover': {
      color: '$intentsBase1 !important',
      bg: '$green11 !important',
      'html[class="fuel_light-theme"] &': {
        color: '$intentsBase12 !important',
        bg: '$green6 !important',
      },
      textDecoration: 'none',
    },
  }),
  activeSectionLink: cssObj({
    color: '$intentsBase1',
    bg: '$green11',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
      bg: '$green6',
    },
  }),
};
