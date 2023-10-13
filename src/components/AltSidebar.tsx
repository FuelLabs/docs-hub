import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink } from '@fuel-ui/react';

import { useDocContext } from '../hooks/useDocContext';
import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';
import type { SidebarLinkItem } from '../types';

import { SidebarSection } from './SidebarSection';

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
        allNavs.map((navOrder, index) => {
          if (index === 0) {
            return (
              <Box key={navOrder.key}>
                <SidebarSection
                  book={navOrder.key}
                  links={navOrder.links}
                  onClick={onClick}
                  docSlug={doc && doc.slug}
                  versions={versions}
                />
              </Box>
            );
          }
        })}
    </Box.Stack>
  );
}

export const styles = {
  root: cssObj({
    gap: '$1',
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
      bg: '$green8 !important',
      'html[class="fuel_light-theme"] &': {
        color: '$intentsBase12 !important',
        bg: '$green6 !important',
      },
      textDecoration: 'none',
    },
  }),
  activeSectionLink: cssObj({
    color: '$intentsBase1',
    bg: '$green8',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
      bg: '$green6',
    },
  }),
};
