/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ButtonLinkProps, ButtonSizes } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
  isActiveMenu?: boolean;
  onClick?: ButtonLinkProps['onClick'];
  size?: ButtonSizes;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, onClick, size, ...props }, ref) => {
    const router = useRouter();
    const isActive = isActiveMenu ?? router.asPath === `/${item.slug}/`;
    const buttonStyles = {
      justifyContent: 'flex-start',
      color: isActive ?? '$green8',
      'html[class="fuel_light-theme"] &': {
        color: isActive ? '$green8' : '$intentsBase12',
      },
      pt: '$1',
      pb: 0,
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'none',
        color: '$green8 !important',
      },
    };

    return (
      <NextLink href={item.slug} legacyBehavior passHref>
        <ButtonLink
          {...props}
          size={size ?? 'sm'}
          ref={ref as any}
          data-active={Boolean(isActive)}
          {...(onClick && { onClick })}
          isExternal={item.isExternal}
          intent={isActive ? 'primary' : 'base'}
          css={buttonStyles}
        >
          {item.label}
        </ButtonLink>
      </NextLink>
    );
  }
);
