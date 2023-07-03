import { cssObj, cx } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

import { capitalize } from '../lib/str';

import type { SidebarLinkItem } from '~/src/types';

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, ...props }, ref) => {
    const pathname = usePathname() || '';
    const slug = item.slug?.startsWith('.')
      ? item.slug.replace('../', '').replace('./', '')
      : item.slug;

    const fullSlug = `/docs/${slug}${slug?.endsWith('/') ? '' : '/'}`;
    const label = item.label.replaceAll(' ', '-');
    const isActive = cx({
      active:
        pathname === fullSlug ||
        (label === slug?.split('/')[1] && pathname.includes(label)),
    });

    return (
      <ButtonLink
        {...props}
        ref={ref}
        as={NextLink}
        href={fullSlug}
        css={styles.root}
        data-active={Boolean(isActive)}
      >
        {capitalize(item.label.replaceAll(/[_-]/g, ' '))}
      </ButtonLink>
    );
  }
);

const styles = {
  root: cssObj({
    justifyContent: 'space-between',
    px: '$0',
    py: '$0',

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

    '&:not([data-active="true"]):hover': {
      textDecoration: 'none',
      color: '$textInverse !important',
    },
  }),
};
