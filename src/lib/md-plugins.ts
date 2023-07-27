import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { codeImport } from './plugins/code-import';
import { fixIndent } from './plugins/fix-indent';
import { handlePlugins } from './plugins/plugins';
import { getMdxCode } from './plugins/rehype-code';

export const remarkPlugins = [
  remarkSlug,
  remarkGfm,
  handlePlugins,
  fixIndent,
  codeImport,
];

export const rehypePlugins = getMdxCode();
