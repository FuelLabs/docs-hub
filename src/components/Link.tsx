import type { LinkProps } from '@fuel-ui/react';
import { Link as FuelLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

function replaceInternalLinks(href: string, base: string) {
  if (
    href.startsWith('https://fuellabs.github.io') &&
    !href.startsWith('https://fuellabs.github.io/block-explorer-v2/') &&
    !href.includes('LICENSE')
  ) {
    href = href
      .replace('https://fuellabs.github.io', '')
      .replace('/master/', '/')
      .replace('.html', '')
      .replace('/latest', '')
      .replace('/index', '/')
      .replace('sway/book/', 'sway/');
    href = `/docs${href}`;

    if (href.includes('fuels-ts/guide/')) {
      href = href.replace('fuels-ts/guide/', 'fuels-ts/');
    }

    const isSwayVersion = href.match(/sway\/(v.+)\/forc/);
    if (isSwayVersion) {
      const version = isSwayVersion[1];
      href = href.replace(`sway/${version}/forc`, 'forc');
    }
  }
  if (href.startsWith('../')) {
    href = href.replace('../', `/${base}/`);
  }
  return href;
}

export function Link(props: LinkProps) {
  const router = useRouter();
  const base = router.asPath.split('/').splice(1, 2).join('/');
  let href = replaceInternalLinks(props.href as string, base);

  if (href?.startsWith('./')) {
    href = `/${base}${href.slice(1)}`;
  }

  return href?.startsWith('http') ? (
    <FuelLink
      {...props}
      isExternal
      css={{ color: '$semanticLinkPrimaryColor !important' }}
    />
  ) : (
    <NextLink href={href} passHref legacyBehavior>
      <FuelLink
        {...props}
        css={{ color: '$semanticLinkPrimaryColor !important', outline: 'none' }}
      />
    </NextLink>
  );
}
