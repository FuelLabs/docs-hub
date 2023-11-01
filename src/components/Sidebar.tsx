import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink } from '@fuel-ui/react';

import { EXTERNAL_NAVIGATION_LINKS } from '../config/constants';
import { useDocContext } from '../hooks/useDocContext';
import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';
import type { SidebarLinkItem } from '../types';

import { SidebarLink, buttonStyles } from './SidebarLink';
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
  isLatest: boolean;
};

export function Sidebar({
  allNavs,
  onClick,
  versions,
  isLatest,
}: SidebarProps) {
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
              css={buttonStyles}
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

      {allNavs && (
        <>
          {/* DOCS */}

          {allNavs.map((navOrder) => {
            const catIndex = isLatest ? 2 : 1;
            let key = navOrder.links[0].slug.split('/')[catIndex];
            if (key === 'sway') {
              key = 'forc';
            }
            return (
              <Box key={navOrder.key}>
                <SidebarSection
                  book={navOrder.key}
                  links={navOrder.links}
                  onClick={onClick}
                  docSlug={doc && doc.slug}
                  version={
                    versions &&
                    Object.values(versions).find((v) => v.name === key)
                  }
                />
              </Box>
            );
          })}
          <Box css={styles.links} />

          {/* EXTERNAL LINKS */}
          {EXTERNAL_NAVIGATION_LINKS.map((item) => (
            <Box key={item.link}>
              <SidebarLink
                item={{ slug: item.name, label: item.name, isExternal: true }}
              />
            </Box>
          ))}
        </>
      )}
    </Box.Stack>
  );
}

export const styles = {
  root: cssObj({
    gap: '$3',
    mb: '$32',
    overflow: 'hidden',
    wordBreak: 'break-word',
  }),
  links: cssObj({
    bg: '$intentsBase10',
    height: '2px',
    my: '$2',
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
      bg: '$semanticLinkPrimaryColor !important',
      'html[class="fuel_light-theme"] &': {
        color: '$intentsBase12 !important',
        bg: '$green6 !important',
      },
      textDecoration: 'none',
    },
  }),
  activeSectionLink: cssObj({
    color: '$intentsBase1',
    bg: '$semanticLinkPrimaryColor',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
      bg: '$green6',
    },
  }),
};
