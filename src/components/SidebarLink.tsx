/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
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
          css={styles.root}
          size="sm"
          data-active={Boolean(isActive)}
          {...(onClick && { onClick })}
        >
          {item.label}
        </ButtonLink>
      </NextLink>
    );
  }
);

export const styles = {
  root: cssObj({
    padding: '$0',
    justifyContent: 'space-between',

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
