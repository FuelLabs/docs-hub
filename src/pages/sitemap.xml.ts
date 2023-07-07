import { getSidebarLinks } from '../lib/api';
import type { SidebarLinkItem } from '../types';
import type { GetServerSideProps } from 'next';

const DOC_SLUGS = [
  'portal',
  'sway',
  'fuels-rs',
  'fuels-ts',
  'wallet',
  'graphql',
  'fuelup',
  'indexer',
  'specs',
  'forc',
];

const TO_EXCLUDE = ['portal', 'wallet', 'graphql'];
const BASE_URL = 'https://docs-hub.vercel.app/docs/';

function createUrl(slug: string) {
  return `${BASE_URL}${slug.replace('../', '').replace('./', '')}`;
}

function isExcludedSlug(slug: string) {
  return !TO_EXCLUDE.includes(slug);
}

function processMenuItems(menu: SidebarLinkItem[]) {
  return menu.reduce((paths: string[], item: SidebarLinkItem) => {
    if (item.submenu) {
      return paths.concat(
        item.submenu.map((url) => createUrl(url.slug as string)),
      );
    }
    if (item.slug && item.slug.split('/').length > 2) {
      paths.push(createUrl(item.slug));
    }
    return paths;
  }, []);
}

function generateSiteMap(links: SidebarLinkItem[][]) {
  const pathsFromDocSlugs = DOC_SLUGS.filter(isExcludedSlug).map(createUrl);
  const paths = pathsFromDocSlugs.concat(
    links.reduce(
      (paths: string[], menu: SidebarLinkItem[]) =>
        paths.concat(processMenuItems(menu)),
      [],
    ),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths.map((p) => `<url><loc>${p}</loc></url>`).join('')}
    </urlset>
  `;
}

export default function SiteMap() {
  // see getServerSideProps
}

export const getServerSideProps: GetServerSideProps<{}> = async ({ res }) => {
  const allLinks: SidebarLinkItem[][] = await Promise.all(
    DOC_SLUGS.flatMap(getSidebarLinks),
  );

  res.setHeader('Content-Type', 'text/xml');
  // send the XML
  res.write(generateSiteMap(allLinks));
  res.end();

  return {
    props: {},
  };
};
