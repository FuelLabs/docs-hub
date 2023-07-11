import { cssObj, cx } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { capitalize } from '../lib/str';

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, ...props }, ref) => {
    const pathname = usePathname() || '';
    const slug = item.slug?.startsWith('.')
      ? item.slug.replace('../', '').replace('./', '')
      : item.slug;

    const isGuide = pathname.includes('guides/');
    const fullSlug = `${
      isGuide ? slug?.replace('guides/', '') : `/docs/${slug}`
    }${slug?.endsWith('/') ? '' : '/'}`;
    const label = item.label.replaceAll(' ', '-');
    const active = pathname.startsWith('/guides/')
      ? pathname.replace('/guides/', '') === fullSlug
      : pathname === fullSlug ||
        (label === slug?.split('/')[1] && pathname.includes(label));
    const isActive = cx({
      active,
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
  },
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
