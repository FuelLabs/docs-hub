/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { capitalize } from '../lib/str';

function getActive(pathname: string, slug: string) {
  // const split = slug.split('/');
  // const pathnameSegments = pathname.split('/');
  // if (slug.includes('guides')) {
  //   return pathname.includes(slug);
  // } else if (split.length > 2) {
  //   const category = pathnameSegments[3];
  //   let active = category === split[2];
  //   if (active) {
  //     if (pathnameSegments.length === 5) {
  //       active = split.length === 3;
  //     } else if (pathnameSegments.length === 6) {
  //       const pageName = pathnameSegments[4];
  //       active = split.length > 3 && pageName === split[3];
  //     }
  //   }
  //   return active;
  // }
  // return pathname === `/${slug}` || pathname === `/${slug}/`;
  return pathname === `/${slug}/`;
}

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
  isActiveMenu?: boolean;
  onClick?: ButtonLinkProps['onClick'];
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, onClick, ...props }, ref) => {
    const router = useRouter();
    const isActive = isActiveMenu ?? getActive(router.asPath, item.slug);

    return (
      <NextLink href={item.slug} legacyBehavior passHref>
        <ButtonLink
          {...props}
          ref={ref as any}
          data-active={Boolean(isActive)}
          {...(onClick && { onClick })}
          isExternal={item.isExternal}
          intent={isActive ? 'primary' : 'base'}
        >
          {item.shouldBeLowerCase ? item.label : capitalize(item.label)}
        </ButtonLink>
      </NextLink>
    );
  }
);
