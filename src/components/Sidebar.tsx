import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink } from '@fuel-ui/react';
import Link from 'next/link';

import { useDocContext } from '../hooks/useDocContext';
import type { NavOrder } from '../pages';
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
};

function SidebarSection({
  links,
  onClick,
  book,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book?: string;
}) {
  const bookHasIndex =
    book?.toLowerCase().replaceAll(/[_-]/g, ' ') ===
    links[0].label.toLowerCase().replaceAll(/[_-]/g, ' ');
  return (
    <>
      {book !== 'guides' && (
        <Link href={links[0].slug} legacyBehavior passHref>
          <ButtonLink css={styles.sectionLink} intent="base">
            {book}
          </ButtonLink>
        </Link>
      )}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {links.map((link: any, index: number) => {
        if (!bookHasIndex || index > 0) {
          return link.slug ? (
            <SidebarLink onClick={onClick} key={link.slug} item={link} />
          ) : (
            <SidebarSubmenu
              onClick={onClick}
              key={link.subpath ? link.subpath + index : index}
              {...link}
            />
          );
        }
      })}
    </>
  );
}

// TODO: use props for guides doc.parent & links

export function Sidebar({ allNavs, onClick }: SidebarProps) {
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
          <SidebarSection book="guides" links={links} onClick={onClick} />
        </>
      )}

      {allNavs &&
        allNavs.map((navOrder) => (
          <Box key={navOrder.key} css={styles.sectionContainer}>
            <SidebarSection
              book={navOrder.key}
              links={navOrder.links}
              onClick={onClick}
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
      textDecoration: 'none',
    },
  }),
  sectionLink: cssObj({
    color: '$textHeading',
    px: 0,
    width: '100%',
    justifyContent: 'flex-start',
    '&:hover': {
      color: '$textHeading !important',
      textDecoration: 'none',
    },
  }),
};
