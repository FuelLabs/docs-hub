import fs from 'fs';
import { globbySync } from 'globby';
import matter from 'gray-matter';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../config/constants';

export type MdxFile = {
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>;
};

export function importMdxFiles(): MdxFile[] {
  const mdxFiles = globbySync([join(DOCS_DIRECTORY, './guides/utils/*.mdx')]);
  console.log('MDX FILES:', mdxFiles);

  return mdxFiles.map((filePath: string) => {
    console.log('FILEPATH', filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);

    return {
      content,
      frontmatter: data,
    };
  });
}
