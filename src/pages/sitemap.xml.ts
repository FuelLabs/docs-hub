import { getSidebarLinks } from '../lib/api';
import type { SidebarLinkItem } from '../types';

const docSlugs = [
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

function generateSiteMap(links: SidebarLinkItem[][]) {
  const paths: string[] = [];
  const baseUrl = 'https://docs-hub.vercel.app/docs/';

  docSlugs.forEach((slug) => {
    if (slug !== 'portal' && slug !== 'wallet' && slug !== 'graphql') {
      paths.push(`${baseUrl}${slug}`);
    }
  });

  links.forEach((menu) => {
    menu.forEach((item) => {
      if (item.submenu) {
        item.submenu.forEach((url) => {
          paths.push(
            `${baseUrl}${url.slug?.replace('../', '').replace('./', '')}`,
          );
        });
      } else if (item.slug) {
        if (item.slug.split('/').length > 2) {
          paths.push(
            `${baseUrl}${item.slug?.replace('../', '').replace('./', '')}`,
          );
        }
      }
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${paths
         .map((path) => {
           return `
         <url>
             <loc>${`${path}`}</loc>
         </url>
       `;
         })
         .join('')}
     </urlset>
   `;
}

function SiteMap() {
  // see getServerSideProps
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps({ res }: any) {
  const allLinks: SidebarLinkItem[][] = [];

  await Promise.all(
    docSlugs.map(async (slug) => {
      const links = await getSidebarLinks(slug);
      allLinks.push(links);
    }),
  );

  const sitemap = generateSiteMap(allLinks);

  res.setHeader('Content-Type', 'text/xml');
  // send the XML
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
