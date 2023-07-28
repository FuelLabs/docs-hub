import type { GetServerSideProps } from 'next';

import { allMdDocs } from '../../.contentlayer/generated';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';

function generateSiteMap() {
  const paths = Docs.getAllPaths(allMdDocs).map((p) => {
    const doc = new Doc(p?.params.slug as string[], allMdDocs);
    return doc.slugForSitemap();
  });

  const uniquePaths = [...new Set(paths)];
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${uniquePaths.map((p) => `<url><loc>${p}</loc></url>`).join('')}
    </urlset>
  `;
}

export default function SiteMap() {
  // see getServerSideProps
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps<any> = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml');
  // send the XML
  res.write(generateSiteMap());
  res.end();

  return {
    props: {},
  };
};
