import { globby } from "globby";
import { join } from "path";
import { DOCS_DIRECTORY } from "../constants";
import { removeDocsPath } from "./urls";

type DocPathType = {
  slug: string;
  path: string;
};

export async function getDocs(): Promise<DocPathType[]> {
  const paths = await globby(["./**/*.mdx", "./**/**.md"], {
    cwd: DOCS_DIRECTORY,
  });
  return paths.map((path) => ({
    slug: removeDocsPath(path),
    path,
  }));
}

export async function getDocFromSlug(slug: string): Promise<DocPathType> {
  const slugs = await getDocs();
  const slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }
  return slugPath;
}

export async function getDocPath({ path }: DocPathType) {
  return join(DOCS_DIRECTORY, path);
}

export async function getDocConfig(name: string) {
  return join(DOCS_DIRECTORY, path);
}
