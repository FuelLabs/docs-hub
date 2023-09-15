/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj, cx } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { LOWER_CASE_NAV_PATHS } from '../config/constants';
import { capitalize } from '../lib/str';

function getActive(pathname: string, slug: string, isLatest: boolean): boolean {
  const slugSegments = slug.split('/');
  const pathnameSegments = pathname.split('/');
  if (slug.includes('guides')) {
    return pathname.includes(slug);
  }
  const categoryIndex = isLatest ? 4 : 3;
  const slugIndex = isLatest ? 3 : 2;
  if (slugSegments.length <= slugIndex) {
    return pathname === `/${slug}/`;
  }
  const categoryMatch =
    pathnameSegments[categoryIndex] === slugSegments[slugIndex];
  const iFactor = isLatest ? 1 : 0;
  if (!categoryMatch) return false;
  if (pathnameSegments.length === 5 + iFactor) {
    return slugSegments.length === 3 + iFactor;
  }
  if (pathnameSegments.length === 6 + iFactor) {
    return (
      slugSegments.length > 3 + iFactor &&
      pathnameSegments[4 + iFactor] === slugSegments[3 + iFactor]
    );
  }
  return false;
}

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
  isActiveMenu?: boolean;
  onClick?: ButtonLinkProps['onClick'];
  isLatest: boolean;
};

export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, onClick, isLatest, ...props }, ref) => {
    const router = useRouter();
    const pathname = router.asPath;
    let slug = item.slug?.replace('../', '').replace('./', '') || '';

    if (!slug.startsWith('guides/')) {
      slug = `docs/${slug}`;
    }
    let active = isActiveMenu;
    if (!active) {
      active = getActive(pathname, slug, isLatest);
    }
    const isActive = cx({
      active,
    });

    let label = item.label.replaceAll(/[_-]/g, ' ');
    const shouldBeLowerCase = LOWER_CASE_NAV_PATHS.some((prefix) =>
      slug.includes(prefix)
    );

    const regex = /(b|B)eta (\d+)/;
    if (regex.test(label)) {
      label = label.replace(regex, '$1eta-$2');
    }

    return (
      <NextLink href={slug} legacyBehavior passHref>
        <ButtonLink
          {...props}
          ref={ref as any}
          css={styles.root}
          data-active={Boolean(isActive)}
          {...(onClick && { onClick })}
        >
          {shouldBeLowerCase ? label : capitalize(label)}
        </ButtonLink>
      </NextLink>
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

    '& .fuel_Icon': {
      color: '$textMuted',
    },
  }),
};
