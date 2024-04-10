import type { GetServerSideProps } from 'next';

import { readFileSync } from 'fs';
import { join } from 'path';
import { DOCS_DIRECTORY } from '../config/constants';

export default function SiteMap() {
  // see getServerSideProps
}

// biome-ignore lint/suspicious/noExplicitAny:
export const getServerSideProps: GetServerSideProps<any> = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml');
  const sitemapPath = join(DOCS_DIRECTORY, '../src/generated/sitemap.xml');
  const sitemap = readFileSync(sitemapPath, 'utf8');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
