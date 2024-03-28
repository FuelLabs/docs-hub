import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateSiteMap } from './generateSitemap.mjs';

function generateSitemapFile() {
  // generate a sitemap file
  const sitemapPath = join(process.cwd(), './src/generated/sitemap.xml');
  const sitemap = generateSiteMap();
  writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Sitemap generated');
}

generateSitemapFile();
