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
    const isSamePage = router.asPath === `/${item.slug}/`;
    const isActive = isActiveMenu ?? isSamePage;
    const isSubmenu = props['data-submenu'];
    const isBookMenu = props['data-bookmenu'];
    const activeStyles = {
      color: isActive ?? '$semanticLinkPrimaryColor',
      'html[class="fuel_light-theme"] &': {
        color: isActive ? '$semanticLinkPrimaryColor' : '$intentsBase12',
        borderLeft:
          !isBookMenu &&
          isSamePage &&
          '2px solid $semanticLinkPrimaryColor !important',
      },
      borderLeft:
        !isBookMenu && isSamePage && '2px solid $semanticLinkPrimaryColor',
      paddingLeft: isSubmenu ? '$8' : '$4',
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
          css={{ ...buttonStyles, ...activeStyles }}
        >
          {item.label}
        </ButtonLink>
      </NextLink>
    );
  }
);

export const buttonStyles = {
  justifyContent: 'flex-start',
  pt: '$1',
  pb: 0,
  borderRadius: 0,
  '&:hover': {
    textDecoration: 'none',
    color: '$semanticLinkPrimaryColor !important',
    '.fuel_Icon': {
      color: '$semanticLinkPrimaryColor !important',
    },
  },
};
