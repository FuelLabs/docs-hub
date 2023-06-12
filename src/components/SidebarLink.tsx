/* eslint-disable @typescript-eslint/no-explicit-any */

import { cx, styled } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

import type { SidebarLinkItem } from '~/src/types';

export const Link = styled(Box, {
  py: '$1',
  px: '$2',
  color: '$gray10',
  borderRadius: '$md',
  '&:focus, &:hover': {
    color: '$gray11',
    background: '$whiteA3',
  },
  '&.active': {
    color: '$accent11',
    background: '$accent2',
  },
  '&:focus': {
    outline: 'none',
  },
});

export type SidebarLinkProps = {
  item: SidebarLinkItem;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item }, ref) => {
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
      <Link
        ref={ref}
        style={{ flexGrow: 1, textTransform: 'capitalize' }}
        as={NextLink as any}
        href={fullSlug}
        className={isActive}
      >
        {item.label}
      </Link>
    );
  }
);
