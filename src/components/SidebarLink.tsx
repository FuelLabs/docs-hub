import { cssObj, cx } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { capitalize } from '../lib/str';

function getActive(pathname: string, slug: string) {
  if (slug.split('/').length > 2 || slug.includes('guides')) {
    return pathname.includes(slug);
  }
  return pathname === `/${slug}` || pathname === `/${slug}/`;
}

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
};

// eslint-disable-next-line react/display-name
export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, ...props }, ref) => {
    const router = useRouter();
    const pathname = router.asPath;
    let slug = item.slug?.replace('../', '').replace('./', '') || '';

    if (!slug.startsWith('guides/')) {
      slug = `docs/${slug}`;
    }

    const active = getActive(pathname, slug);
    const isActive = cx({
      active,
    });

    const label = item.label.replaceAll(/[_-]/g, ' ');
    const shouldBeLowerCase =
      slug.startsWith('docs/forc/commands/') ||
      slug.startsWith('docs/forc/plugins/') ||
      slug.startsWith('docs/indexer/forc-index/') ||
      slug.startsWith('docs/indexer/forc-postgres/');

    return (
      <ButtonLink
        {...props}
        ref={ref}
        as={NextLink}
        href={slug}
        css={styles.root}
        data-active={Boolean(isActive)}
      >
        {shouldBeLowerCase ? label : capitalize(label)}
      </ButtonLink>
    );
  }
);

export const styles = {
  root: cssObj({
    px: '$0',
    py: '$0',
    justifyContent: 'space-between',
    fontSize: '$sm',
    height: '$6',
    position: 'relative',
    color: '$textColor',

    '&:not([aria-disabled="true"]):active, &:not([aria-disabled="true"])[aria-pressed="true"]':
      {
        outline: 'none',
        outlineOffset: 'none',
        outlineColor: 'transparent',
        transform: 'none',
      },

    '&[data-active="true"], &[data-active="true"]:hover': {
      color: '$textLink',
      textDecoration: 'none',
    },

    '&[data-active="true"]:is([data-submenu="true"])': {
      '&::before': {
        position: 'absolute',
        display: 'block',
        content: '""',
        top: 0,
        left: '-18px',
        width: '1px',
        height: '100%',
        backgroundColor: '$textLink',
      },
    },

    '&:not([data-active="true"]):hover': {
      textDecoration: 'none',
      color: '$textInverse !important',
    },
  }),
};
