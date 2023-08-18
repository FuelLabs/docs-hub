import { cssObj, cx } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { ButtonLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { Dispatch, SetStateAction } from 'react';
import { forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { LOWER_CASE_NAV_PATHS } from '../config/constants';
import { capitalize } from '../lib/str';

function getActive(pathname: string, slug: string) {
  const split = slug.split('/');
  const pathnameSegments = pathname.split('/');
  if (slug.includes('guides')) {
    return pathname.includes(slug);
  } else if (split.length > 2) {
    const category = pathnameSegments[3];
    let active = category === split[2];
    if (active) {
      if (pathnameSegments.length === 5) {
        active = split.length === 3;
      } else if (pathnameSegments.length === 6) {
        const pageName = pathnameSegments[4];
        active = split.length > 3 && pageName === split[3];
      }
    }
    return active;
  }
  return pathname === `/${slug}` || pathname === `/${slug}/`;
}

export type SidebarLinkProps = ButtonLinkProps & {
  item: SidebarLinkItem;
  isActiveMenu?: boolean;
  handleClick: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line react/display-name
export const SidebarLink = forwardRef<unknown, SidebarLinkProps>(
  ({ item, isActiveMenu, handleClick, ...props }, ref) => {
    const router = useRouter();
    const pathname = router.asPath;
    let slug = item.slug?.replace('../', '').replace('./', '') || '';

    if (!slug.startsWith('guides/')) {
      slug = `docs/${slug}`;
    }
    let active = isActiveMenu;
    if (!active) {
      active = getActive(pathname, slug);
    }
    const isActive = cx({
      active,
    });

    const label = item.label.replaceAll(/[_-]/g, ' ');
    const shouldBeLowerCase = LOWER_CASE_NAV_PATHS.some((prefix) =>
      slug.startsWith(prefix)
    );

    return (
      <ButtonLink
        {...props}
        ref={ref}
        as={NextLink}
        href={slug}
        css={styles.root}
        data-active={Boolean(isActive)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={handleClick as any}
      >
        {shouldBeLowerCase ? label : capitalize(label)}
      </ButtonLink>
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
