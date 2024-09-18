import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink } from '@fuel-ui/react';

import { EXTERNAL_NAVIGATION_LINKS } from '../config/constants';
import { useDocContext } from '../hooks/useDocContext';
import type { NavOrder, SidebarLinkItem, VersionSet, Versions } from '../types';

import { FeedbackForm } from './FeedbackForm';
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
  versionSet: VersionSet;
};

export function Sidebar({
  allNavs,
  onClick,
  versions,
  versionSet,
}: SidebarProps) {
  const ctx = useDocContext();
  const { links, doc } = ctx;

  return (
    <Box.Stack as='nav' css={styles.root} className='Sidebar'>
      {!allNavs && doc && (
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
            book='guides'
            bookName='guides'
            links={links}
            onClick={onClick}
            docSlug={doc?.slug}
          />
        </>
      )}

      {allNavs && (
        <>
          {/* DOCS */}
          {allNavs.map((navOrder) => {
            const catIndex = versionSet === 'default' ? 1 : 2;
            console.log('nav', navOrder);

            let slug = navOrder.links[0]?.slug;

            if (!slug && navOrder.links[0]?.submenu?.[0]?.slug) {
              slug = navOrder.links[0].submenu[0].slug;
            }

            if (!slug) {
              console.warn(`No slug found for navOrder.key: ${navOrder.key}`);
              return null;
            }

            let key = slug.split('/')[catIndex];
            if (key === 'sway') {
              key = 'forc';
            }

            return (
              <Box key={navOrder.key}>
                <SidebarSection
                  book={navOrder.key}
                  bookName={navOrder.sidebarName}
                  links={navOrder.links}
                  onClick={onClick}
                  docSlug={doc?.slug}
                  version={
                    versions &&
                    Object.values(versions).find((v) => v.name.includes(key))
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
                item={{
                  slug: item.link,
                  label: item.name,
                  isExternal: item.link.includes('http'),
                  breadcrumbs: [],
                }}
              />
            </Box>
          ))}
          <FeedbackForm />
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
