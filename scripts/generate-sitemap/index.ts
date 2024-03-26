import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { generateSiteMap } from "../../src/pages/sitemap.xml";

function generateSitemapFile(){
  // generate a sitemap file
  const sitemapPath = join(process.cwd(), './src/generated/sitemap.xml');
  if (!existsSync(sitemapPath)) {
    console.log("SITEMAP FILE DOESN'T EXIST. GENERATING...");
    const sitemap = generateSiteMap();
    writeFileSync(sitemapPath, sitemap, 'utf8');
  }
}

generateSitemapFile();