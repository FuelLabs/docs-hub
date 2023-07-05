/* eslint-disable no-continue */
import fs from "fs";
import { globby } from "globby";
import matter from "gray-matter";
import { join } from "path";

const DOCS_DIRECTORY = join(process.cwd(), "./docs");
const docConfigPath = join(DOCS_DIRECTORY, "../portal/docs.json");
const configFile = JSON.parse(fs.readFileSync(docConfigPath, "utf8"));

// GENERATES SIDEBAR LINKS
await main();

async function main() {
  await Promise.all(
    Object.keys(configFile).map(async (key) => {
      const config = configFile[key];
      const slugs = await getDocs(config);
      const final = slugs.map(({ slug }) => getDocBySlug(slug, slugs, config));
      const sortedLinks = getSortedLinks(config, final);
      const json = JSON.stringify(sortedLinks);
      const folderPath = "src/sidebar-links";
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      fs.writeFileSync(`${folderPath}/${key}.json`, json, "utf-8");
    })
  );
}

function getSortedLinks(config, docs) {
  const links = [];
  const lcOrder = config.menu.map((o) => o.toLowerCase());

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (doc.category === "forc_client") {
      doc.category = "plugins";
    }

    if (
      !doc.category ||
      doc.category === "src" ||
      doc.category === "forc" ||
      (doc.category === "guide" && doc.title === "guide")
    ) {
      let newLabel = doc.title;
      if (doc.title === "index" || doc.title === "README") {
        const arr = doc.slug.split("/");
        newLabel = arr[arr.length - 1];
      }
      links.push({ slug: doc.slug, label: newLabel });
      continue;
    }

    const categoryIdx = links.findIndex((l) => {
      return l?.label === doc.category;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = links[categoryIdx]?.submenu || [];
      let newLabel = doc.title;
      if (doc.title === "index") {
        const arr = doc.slug.split("/");
        newLabel = arr[arr.length - 1];
      }
      if (doc.category === doc.title || doc.title === "index") {
        links[categoryIdx].hasIndex = true;
      }
      submenu.push({
        slug: doc.slug,
        label: newLabel,
      });
      continue;
    }
    let hasIndex = false;
    if (doc.category === doc.title) {
      hasIndex = true;
    }
    const subpath = doc.slug.split("/")[1];
    const submenu = [{ slug: doc.slug, label: doc.title }];
    links.push({
      subpath,
      label: doc.category,
      submenu,
      hasIndex,
    });
    /** Insert inside category submenu if category is already on array */
  }

  const sortedLinks = lcOrder
    ? links
        /** Sort first level links */
        .sort((a, b) => {
          const lowerA = a.label.toLowerCase();
          const lowerB = b.label.toLowerCase();
          const aIdx = lcOrder.indexOf(lowerA);
          const bIdx = lcOrder.indexOf(lowerB);
          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i.startsWith(lowerA))?.[0];
            const bFirst = lcOrder.filter((i) => i.startsWith(lowerB))?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          const category = a.subpath ? lowerA : lowerB;
          const first = lcOrder.filter((i) => i.startsWith(category))?.[0];
          const idx = lcOrder.indexOf(first);
          return a.subpath ? idx - bIdx : aIdx - idx;
        })
        /** Sort categoried links */
        .map((link) => {
          if (!link.submenu) return link;
          const key = `${link.label.toLowerCase().replaceAll(" ", "_")}_menu`;
          let catOrder = config[key];
          catOrder = catOrder?.map((title) => title.toLowerCase());
          const submenu = link.submenu.sort((a, b) => {
            const lowerA = a.label.toLowerCase();
            const lowerB = b.label.toLowerCase();
            const result = catOrder
              ? catOrder.indexOf(`${lowerA}`) - catOrder.indexOf(`${lowerB}`)
              : 0;
            return result;
          });
          return { ...link, submenu };
        })
    : links;

  return sortedLinks;
}

async function getDocs(config) {
  let paths = [];
  switch (config.slug) {
    case "sway":
      paths = [
        // SWAY DOCS
        "./sway/docs/book/src/**/*.md",
        // IGNORE ALL SUMMARY PAGES
        "!**/SUMMARY.md",
        // IGNORE FORC PAGES
        "!./sway/docs/book/src/forc/*.md",
        "!./sway/docs/book/src/forc/**/*.md",
      ];
      break;
    case "forc":
      paths = [
        // FORC DOCS
        "./sway/docs/book/src/forc/*.md",
        "./sway/docs/book/src/forc/**/*.md",
        // REMOVE UNUSED FILES
        "!./sway/docs/book/src/forc/commands/forc_deploy.md",
        "!./sway/docs/book/src/forc/commands/forc_run.md",
      ];
      break;
    case "fuels-rs":
      paths = [
        // RUST SDK DOCS
        "./fuels-rs/docs/src/**/*.md",
        "./fuels-rs/docs/src/*.md",
        // IGNORE ALL SUMMARY PAGES
        "!**/SUMMARY.md",
      ];
      break;
    case "fuels-ts":
      paths = [
        // TS SDK DOCS
        "./fuels-ts/apps/docs/src/*.md",
        "./fuels-ts/apps/docs/src/**/*.md",
        "./fuels-ts/apps/docs/src/**/*.md",
      ];
      break;
    case "wallet":
      paths = [
        // WALLET DOCS
        "./fuels-wallet/packages/docs/docs/**/*.mdx",
        "./fuels-wallet/packages/docs/docs/*.mdx",
      ];
      break;
    case "graphql":
      paths = [
        // GRAPHQL DOCS
        "./fuel-graphql-docs/docs/*.mdx",
        "./fuel-graphql-docs/docs/**/*.mdx",
      ];
      break;
    case "fuelup":
      paths = [
        // FUELUP DOCS
        "./fuelup/docs/src/*.md",
        "./fuelup/docs/src/**/*.md",
        // IGNORE ALL SUMMARY PAGES
        "!**/SUMMARY.md",
      ];
      break;
    case "indexer":
      paths = [
        // INDEXER DOCS
        "./fuel-indexer/docs/src/*.md",
        "./fuel-indexer/docs/src/**/*.md",
        // IGNORE ALL SUMMARY PAGES
        "!**/SUMMARY.md",
      ];
      break;
    case "specs":
      paths = [
        // SPECS DOCS
        "./fuel-specs/src/*.md",
        "./fuel-specs/src/**/*.md",
        // IGNORE ALL SUMMARY PAGES
        "!**/SUMMARY.md",
      ];
      break;
    default:
      paths = [
        // PORTAL DOCS
        "../portal/*.md",
        "../portal/*.mdx",
        "../portal/**/*.mdx",
      ];
      break;
  }

  paths = await globby(paths, {
    cwd: DOCS_DIRECTORY,
  });

  const final = paths.map((path) => {
    return {
      slug: removeDocsPath(path),
      path,
    };
  });
  return final;
}

function removeDocsPath(path) {
  // clean up the url paths
  const configPath = join(DOCS_DIRECTORY, `../src/paths.json`);
  const pathsConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  let newPath = path;
  Object.keys(pathsConfig).forEach((key) => {
    newPath = newPath.replaceAll(key, pathsConfig[key]);
  });

  // handle mdbooks folders that use a same name file instead of index.md
  const paths = newPath.split("/");
  const length = paths.length - 1;
  const last = paths[length].split(".")[0];
  const cat = paths[length - 1];
  if (last === cat) {
    paths.pop();
    newPath = `${paths.join("/")}/`;
  }

  // move forc docs to their own section
  if (path.includes("/forc/")) {
    newPath = newPath.replace("sway/", "");
  }

  return newPath;
}

function getDocBySlug(slug, slugs, docsConfig) {
  let slugPath = slugs.find(
    ({ slug: pathSlug }) => pathSlug === `./${slug}.md`
  );
  if (!slugPath) {
    slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  }
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }

  const fullpath = join(DOCS_DIRECTORY, slugPath.path);
  const document = fs.readFileSync(fullpath, "utf8");
  const { data } = matter(document);
  if (!data.title) {
    const paths = fullpath.split("/");
    data.title = paths
      .pop()
      ?.replace(/\.(md|mdx)$/, "")
      .replaceAll(/[_-]/g, " ");
    data.category = paths.pop()?.replaceAll("-", " ");
  }

  const doc = {};
  const FIELDS = ["title", "slug", "content", "category"];

  // Ensure only the minimal needed data is exposed
  FIELDS.forEach((field) => {
    if (field === "slug") {
      doc[field] = data.slug || slug.replace(/(\.mdx|\.md)$/, "");
    }
    if (typeof data[field] !== "undefined") {
      doc[field] = data[field];
    }
  });

  if (doc.category === "forc_client") {
    doc.category = "plugins";
  }
  if (doc.title === "index") {
    doc.title =
      doc.category === "src"
        ? slug.replace("./", "").replace(".md", "")
        : doc.category;
  }

  if (doc.title === "README") {
    const arr = doc.slug.split("/");
    const newLabel = arr[arr.length - 1];
    doc.title = newLabel;
  }

  return {
    ...doc,
    docsConfig,
  };
}
