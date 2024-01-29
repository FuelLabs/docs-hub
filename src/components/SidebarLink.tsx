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
  isIndex?: boolean;
  onClick?: ButtonLinkProps['onClick'];
  size?: ButtonSizes;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, isIndex, onClick, size, ...props }, ref) => {
    const router = useRouter();
    const cleanRoute = router.asPath.split('#')[0];
    const isSamePage =
      cleanRoute === '/'
        ? item.slug === 'docs/intro/what-is-fuel'
        : router.asPath.split('#')[0] === `/${item.slug}/`;
    const isSubmenu = props['data-submenu'];
    const activeStyles = {
      color: isSamePage ?? '$semanticLinkPrimaryColor',
      fontWeight: isActiveMenu && !isSamePage ? '550' : 'normal',
      'html[class="fuel_light-theme"] &': {
        color: isSamePage ? '#009957' : '$intentsBase12',
        borderLeft: isSamePage && '2px solid #009957 !important',
      },
      borderTop: 'none !important',
      borderBottom: 'none !important',
      borderRight: 'none !important',
      borderLeft: isSamePage
        ? '2px solid $semanticLinkPrimaryColor !important'
        : 'none !important',
      paddingLeft: isSubmenu ? '$8' : '$4',
    };

    return (
      <NextLink href={item.slug} legacyBehavior passHref>
        <ButtonLink
          {...props}
          size={size}
          ref={ref as any}
          data-active={Boolean(isSamePage)}
          {...(onClick && { onClick })}
          isExternal={item.isExternal}
          intent={isSamePage ? 'primary' : 'base'}
          css={{ ...buttonStyles, ...activeStyles }}
        >
          {isIndex ? 'About' : item.label}
        </ButtonLink>
      </NextLink>
    );
  }
);

export const buttonStyles = {
  justifyContent: 'flex-start',
  fontSize: '14.6px',
  pt: '$1',
  pb: 0,
  borderRadius: 0,
  '&:hover': {
    textDecoration: 'none',
    cursor: 'pointer',
    color: '$semanticLinkPrimaryColor !important',
    '.fuel_Icon': {
      color: '$semanticLinkPrimaryColor !important',
    },
  },
  '.fuel_Button:not([aria-disabled=true]):active': {
    transform: 'none !important',
  },
};
