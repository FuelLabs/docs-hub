import { cssObj } from '@fuel-ui/css';
import type { LinkProps } from '@fuel-ui/react';
import { Link as FuelLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

function replaceInternalLinks(href: string, base: string) {
  if (
    href.startsWith('https://fuellabs.github.io') &&
    !href.includes('fuellabs.github.io/block-explorer-v2') &&
    !href.startsWith('https://fuellabs.github.io/sway/master/std/') &&
    !href.includes('LICENSE')
  ) {
    href = href
      .replace('https://fuellabs.github.io', '')
      .replace('/master/', '/')
      .replace('.html', '')
      .replace('/nightly', '')
      .replace(/\/index$/, '/')
      .replace('sway/book/', 'sway/')
      .replace('sway/forc/', 'forc/')
      .replace('/fuel-specs/', '/specs/')
      .replace(/\/v\d+\.\d+\.\d+\//, '/')
      .replace('/specs/vm', '/specs/fuel-vm');
    href = `/docs${href}`;

    const isSwayVersion = href.match(/sway\/(v.+)\/forc/);
    if (isSwayVersion) {
      const version = isSwayVersion[1];
      href = href.replace(`sway/${version}/forc`, 'forc');
    }
  }

  if (href.startsWith('../')) {
    href = href.replace('../', `/${base}/`);
  }
  if (href.startsWith('./../')) {
    href = href.replace('./../', `/${base}/`);
  }

  if (!href.endsWith('/forc/plugins/forc_client/')) {
    href = href.replace('/forc/plugins/forc_client/', '/forc/plugins/');
  }

  // TODO: fix this at source
  href = href
    .replace(
      'docs/fuel-docs/quickstart/developer-quickstart',
      '/guides/quickstart/'
    )
    .replace(
      'https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html',
      '/guides/quickstart/'
    )
    .replace('specs/fuel-vm/instruction_set', 'specs/fuel-vm/instruction-set')
    .replace('specs/protocol/tx_format', 'specs/tx-format/')
    .replace('docs/fuelup/latest', 'docs/fuelup')
    .replace('specs/protocol/id/contract', 'specs/identifiers/contract-id')
    .replace('/packag/', '/package/');

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
    <FuelLink {...props} isExternal css={styles.link} />
  ) : (
    <NextLink href={href} passHref legacyBehavior>
      <FuelLink {...props} css={styles.link} />
    </NextLink>
  );
}

const styles = {
  link: cssObj({
    'html[class="fuel_light-theme"] &': {
      color: '#009957 !important',
    },
    'html[class="fuel_dark-theme"] &': {
      color: '$semanticLinkPrimaryColor !important',
    },
    outline: 'none',
  }),
};
