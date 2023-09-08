/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
  isActiveMenu?: boolean;
  onClick?: ButtonLinkProps['onClick'];
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, onClick, ...props }, ref) => {
    const router = useRouter();
    const isActive = isActiveMenu ?? router.asPath === `/${item.slug}/`;

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
          {item.label}
        </ButtonLink>
      </NextLink>
    );
  }
);
